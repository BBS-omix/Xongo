import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

type Lang = 'en' | 'tr';
type RiskLevel = 'high' | 'medium' | 'low';

type MaybeI18n = string | { en?: string; tr?: string };

type RiskItem = {
  title?: MaybeI18n;
  description?: MaybeI18n;
  mitigation?: MaybeI18n;
  level?: RiskLevel;                // defaults to 'medium'
  impact?: number;                  // 0..1 optional
  likelihood?: number;              // 0..1 optional
  // legacy props that may exist; ignored by table logic but kept for editor compatibility
  color?: 'red' | 'orange' | 'yellow';
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const toPct = (n: number) => `${Math.round(clamp01(n) * 100)}%`;

// robust extractor: works with string or {en,tr} or undefined
const t = (val: MaybeI18n | undefined, lang: Lang, fallback = ''): string => {
  if (val == null) return fallback;
  if (typeof val === 'string') return val;
  return val[lang] ?? val.en ?? fallback;
};

export function Risks() {
  const { language, creatorMode } = usePresentationContext();
  const lang = (language as Lang) ?? 'en';
  const { risks } = presentationData;

  // State
  const [risksTitle, setRisksTitle] = useState<Record<Lang, string>>(
    (risks?.title as Record<Lang, string>) ?? { en: 'Risks & Mitigations', tr: 'Riskler ve Önlemler' }
  );
  const [risksCategories, setRisksCategories] = useState<RiskItem[]>(
    (risks?.categories as RiskItem[]) ?? []
  );

  // icons/labels for qualitative level
  const levelIcon = (lvl: RiskLevel) =>
    lvl === 'high' ? <AlertTriangle className="w-4 h-4" /> :
    lvl === 'medium' ? <AlertCircle className="w-4 h-4" /> :
    <Info className="w-4 h-4" />;

  const levelLabel = (lvl: RiskLevel) =>
    lang === 'en' ? (lvl === 'high' ? 'High' : lvl === 'medium' ? 'Medium' : 'Low')
                  : (lvl === 'high' ? 'Yüksek' : lvl === 'medium' ? 'Orta' : 'Düşük');

  // defaults if numeric fields are missing
  const defaults: Record<RiskLevel, { impact: number; likelihood: number }> = {
    high:   { impact: 0.85, likelihood: 0.75 },
    medium: { impact: 0.60, likelihood: 0.50 },
    low:    { impact: 0.35, likelihood: 0.30 },
  };

  // heat color (soft green → yellow → red)
  const heatColor = (score01: number) => {
    const g = [220, 252, 231]; // #dcfce7
    const y = [254, 249, 195]; // #fef9c3
    const r = [254, 226, 226]; // #fee2e2
    const t = clamp01(score01);
    const lerp = (a: number[], b: number[], k: number) =>
      `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)}, ${Math.round(a[1] + (b[1] - a[1]) * k)}, ${Math.round(a[2] + (b[2] - a[2]) * k)})`;
    return t <= 0.5 ? lerp(g, y, t / 0.5) : lerp(y, r, (t - 0.5) / 0.5);
  };

  // compute rows with safe fallbacks
  const rows = useMemo(() => {
    return (risksCategories || []).map((risk) => {
      const lvl: RiskLevel = (risk.level as RiskLevel) || 'medium';
      const base = defaults[lvl] || defaults.medium;
      const impact = clamp01(risk.impact ?? base.impact);
      const likelihood = clamp01(risk.likelihood ?? base.likelihood);
      const score = impact * likelihood;
      return {
        title: t(risk.title, lang, lang === 'en' ? 'Untitled risk' : 'Başlıksız risk'),
        description: t(risk.description, lang, ''),
        mitigation: t(risk.mitigation, lang, ''),
        level: lvl,
        impact,
        likelihood,
        score
      };
    });
  }, [risksCategories, lang]);

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Editor */}
        {creatorMode && (
          <ContentEditor
            title="Risks Title"
            data={[{ id: 'risks_title', content: risksTitle }]}
            onSave={(newData) => setRisksTitle(newData[0].content)}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[{ key: 'content', label: 'Title', type: 'text', multilingual: true }]}
          />
        )}

        <div className="text-center mb-8">
          <h2 className="font-poppins font-bold text-3xl text-secondary">
            {risksTitle[lang]}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {lang === 'en'
              ? 'Impact × Likelihood heatmap. Edit numerics in creator mode.'
              : 'Etki × Olasılık ısı haritası. Sayısal değerleri düzenlemek için oluşturucu modunu kullanın.'}
          </p>
        </div>

        {/* Editor for rows */}
        {creatorMode && (
          <div className="relative mb-4">
            <ContentEditor
              title="Risk Categories"
              data={risksCategories}
              onSave={setRisksCategories}
              className="absolute right-0 -top-2 z-10"
              type="table"
              fields={[
                { key: 'title', label: 'Title', type: 'text', multilingual: true },
                { key: 'description', label: 'Description', type: 'textarea', multilingual: true },
                { key: 'mitigation', label: 'Mitigation', type: 'textarea', multilingual: true },
                { key: 'level', label: 'Level', type: 'select', options: ['high', 'medium', 'low'] },
                { key: 'impact', label: 'Impact (0..1)', type: 'number' },
                { key: 'likelihood', label: 'Likelihood (0..1)', type: 'number' }
              ]}
            />
          </div>
        )}

        {/* Heatmap Table */}
        <Card className="overflow-hidden rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{lang === 'en' ? 'Risk' : 'Risk'}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{lang === 'en' ? 'Severity' : 'Şiddet'}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{lang === 'en' ? 'Impact' : 'Etki'}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{lang === 'en' ? 'Likelihood' : 'Olasılık'}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{lang === 'en' ? 'Heat (I×L)' : 'Isı (E×O)'}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{lang === 'en' ? 'Mitigations' : 'Önlemler'}</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {rows.map((r, idx) => {
                  const impactPct = toPct(r.impact);
                  const likelyPct = toPct(r.likelihood);
                  const scorePct = toPct(r.score);
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-xs text-gray-500">{idx + 1}</td>

                      {/* Risk + description */}
                      <td className="px-4 py-3 align-top">
                        <div className="text-sm font-semibold text-gray-900">{r.title}</div>
                        {r.description && (
                          <div className="text-xs text-gray-600 mt-1">{r.description}</div>
                        )}
                      </td>

                      {/* Severity */}
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            r.level === 'high'
                              ? 'bg-red-100 text-red-700'
                              : r.level === 'medium'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                          title={lang === 'en' ? 'Severity (qualitative)' : 'Şiddet (nitel)'}
                        >
                          {levelIcon(r.level)} {levelLabel(r.level)}
                        </span>
                      </td>

                      {/* Impact */}
                      <td className="px-4 py-3 align-top">
                        <div className="text-xs text-gray-700 mb-1">{impactPct}</div>
                        <div className="h-2 w-28 bg-gray-200 rounded">
                          <div className="h-2 rounded" style={{ width: impactPct, backgroundColor: heatColor(r.impact) }} />
                        </div>
                      </td>

                      {/* Likelihood */}
                      <td className="px-4 py-3 align-top">
                        <div className="text-xs text-gray-700 mb-1">{likelyPct}</div>
                        <div className="h-2 w-28 bg-gray-200 rounded">
                          <div className="h-2 rounded" style={{ width: likelyPct, backgroundColor: heatColor(r.likelihood) }} />
                        </div>
                      </td>

                      {/* Heat */}
                      <td className="px-4 py-3 align-top">
                        <div
                          className="w-28 h-8 rounded border border-black/5 flex items-center justify-center text-xs font-semibold"
                          style={{ backgroundColor: heatColor(r.score) }}
                          title={(lang === 'en' ? 'Score: ' : 'Puan: ') + scorePct}
                        >
                          {scorePct}
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-0.5 w-16">
                          {[0.25, 0.5, 0.75, 1].map((tval, i) => (
                            <div key={i} className="h-3 rounded" style={{ backgroundColor: heatColor(tval * r.score + (1 - tval) * 0.1) }} />
                          ))}
                        </div>
                      </td>

                      {/* Mitigation */}
                      <td className="px-4 py-3 align-top">
                        {r.mitigation ? (
                          <div className="text-xs text-gray-700">{r.mitigation}</div>
                        ) : (
                          <div className="text-xs text-gray-400 italic">
                            {lang === 'en' ? 'Add mitigation…' : 'Önlem ekleyin…'}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Legend */}
              <tfoot>
                <tr>
                  <td colSpan={7} className="px-4 py-4 bg-gray-50">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="font-semibold">{lang === 'en' ? 'Legend:' : 'Lejand:'}</span>
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: heatColor(0.15) }} /> {lang === 'en' ? 'Low' : 'Düşük'}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: heatColor(0.5) }} /> {lang === 'en' ? 'Medium' : 'Orta'}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: heatColor(0.85) }} /> {lang === 'en' ? 'High' : 'Yüksek'}
                      </span>
                      <span className="ml-auto text-[11px] text-gray-500">
                        {lang === 'en'
                          ? 'If impact/likelihood are missing, defaults are inferred from severity.'
                          : 'Etki/olasılık yoksa, şiddete göre varsayılanlar kullanılır.'}
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}
