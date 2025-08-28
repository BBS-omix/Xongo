import { usePresentationContext } from '@/contexts/presentation-context';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts';

export function CustomerSegmentsTable() {
  const { language, creatorMode } = usePresentationContext();

  // helpers
  const fmtMoney = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toFixed(0)}`;
  };

  const meanWeeks = (range: string) => {
    const lower = range.toLowerCase();
    if (lower.includes('month')) {
      const [a, b] = lower.replace(/[^0-9\-]/g, '').split('-').map(Number);
      const midMonths = (a && b) ? (a + b) / 2 : (a || 0);
      return midMonths * 4.33;
    }
    if (lower.includes('week')) {
      const [a, b] = lower.replace(/[^0-9\-]/g, '').split('-').map(Number);
      return (a && b) ? (a + b) / 2 : (a || 0);
    }
    return 0;
  };

  const [tableTitle, setTableTitle] = useState({
    en: 'Customer Segment Analysis (24 Months)',
    tr: 'Müşteri Segment Analizi (24 Ay)'
  });
  const [tableSubtitle, setTableSubtitle] = useState({
    en: 'Year-1 (Sep-25→Aug-26) and Year-2 (Sep-26→Aug-27) targets with ARR run-rate at each year end',
    tr: '1. Yıl (Eyl-25→Ağu-26) ve 2. Yıl (Eyl-26→Ağu-27) hedefleri; yıl sonu ARR koşu hızı'
  });

  // Pricing model (monthly: Basic $2.3k, Pro $6k, Enterprise $35k) → ACV:
  const ACV = { basic: 27_600, pro: 72_000, ent: 420_000 };

  // Targets from plan: Y1 end (Aug-26): B2/P1/E0; Y2 end (Aug-27): B25/P16/E5
  const SEGMENTS = [
    {
      key: 'basic',
      segment: { en: 'Basic', tr: 'Temel' },
      description: { en: 'Small Business', tr: 'Küçük İşletme' },
      acvStr: '$27.6K',
      acvValue: ACV.basic,
      salesCycle: { en: '4-8 weeks', tr: '4-8 hafta' },
      implementation: { en: 'On-site 1–2 days', tr: 'Yerinde 1–2 gün' },
      deployment: { en: 'Cloud SaaS', tr: 'Bulut SaaS' },
      tier: { en: 'Basic', tr: 'Temel' },
      cacPayback: { en: '6-12 months', tr: '6-12 ay' },
      y1Target: 2,
      y2Target: 30
    },
    {
      key: 'pro',
      segment: { en: 'Pro', tr: 'Pro' },
      description: { en: 'Medium Business', tr: 'Orta İşletme' },
      acvStr: '$72K',
      acvValue: ACV.pro,
      salesCycle: { en: '8-16 weeks', tr: '8-16 hafta' },
      implementation: { en: 'On-site 2–4 days', tr: 'Yerinde 2–4 gün' },
      deployment: { en: 'Cloud/Hybrid', tr: 'Bulut/Hibrit' },
      tier: { en: 'Pro', tr: 'Pro' },
      cacPayback: { en: '9-15 months', tr: '9-15 ay' },
      y1Target: 1,
      y2Target: 12
    },
    {
      key: 'enterprise',
      segment: { en: 'Enterprise', tr: 'Kurumsal' },
      description: { en: '1000+ employees', tr: '1000+ çalışan' },
      acvStr: '$144K',
      acvValue: 134000,
      salesCycle: { en: '6-18 months', tr: '6-18 ay' },
      implementation: { en: '8-16 weeks', tr: '8-16 hafta' },
      deployment: { en: 'On-Prem/Private', tr: 'Yerinde/Özel' },
      tier: { en: 'Enterprise', tr: 'Kurumsal' },
      cacPayback: { en: '12-18 months', tr: '12-18 ay' },
      y1Target: 0,
      y2Target: 4
    }
  ];

  const [segmentData, setSegmentData] = useState(SEGMENTS);

  const totals = useMemo(() => {
    const sumY1Cust = segmentData.reduce((s, x) => s + (x.y1Target || 0), 0);
    const sumY2Cust = segmentData.reduce((s, x) => s + (x.y2Target || 0), 0);
    const arrY1 = segmentData.reduce((s, x) => s + x.acvValue * (x.y1Target || 0), 0);
    const arrY2 = segmentData.reduce((s, x) => s + x.acvValue * (x.y2Target || 0), 0);
    const weightedACV_Y2 = sumY2Cust ? arrY2 / sumY2Cust : 0;
    const blendedWeeks_Y2 = sumY2Cust
      ? segmentData.reduce((s, x) => s + meanWeeks(x.salesCycle.en) * (x.y2Target || 0), 0) / sumY2Cust
      : 0;
    return { sumY1Cust, sumY2Cust, arrY1, arrY2, weightedACV_Y2, blendedWeeks_Y2 };
  }, [segmentData]);

  const headers = [
    { key: 'segment', label: { en: 'Customer Segment', tr: 'Müşteri Segmenti' }, width: 'w-32' },
    { key: 'acv', label: { en: 'ACV', tr: 'ACV' }, width: 'w-20' },
    { key: 'salesCycle', label: { en: 'Sales Cycle', tr: 'Satış Döngüsü' }, width: 'w-28' },
    { key: 'implementation', label: { en: 'Implementation', tr: 'Uygulama' }, width: 'w-32' },
    { key: 'deployment', label: { en: 'Deployment', tr: 'Dağıtım' }, width: 'w-32' },
    { key: 'tier', label: { en: 'Product Tier', tr: 'Ürün Katmanı' }, width: 'w-28' },
    { key: 'cacPayback', label: { en: 'CAC Payback', tr: 'CAC Geri Ödeme' }, width: 'w-28' },
    { key: 'y1Target', label: { en: 'Y1 Target (Aug-26)', tr: 'Y1 Hedef (Ağu-26)' }, width: 'w-24' },
    { key: 'y2Target', label: { en: 'Y2 Target (Aug-27)', tr: 'Y2 Hedef (Ağu-27)' }, width: 'w-24' },
    { key: 'total24', label: { en: '24M Total', tr: '24 Ay Toplam' }, width: 'w-24' },
    { key: 'arrY1', label: { en: 'ARR @Y1 End', tr: 'ARR @Y1 Sonu' }, width: 'w-28' },
    { key: 'arrY2', label: { en: 'ARR @Y2 End', tr: 'ARR @Y2 Sonu' }, width: 'w-28' }
  ];

  const getTierColor = (tier: string) => {
    if (tier.includes('Basic') || tier.includes('Temel')) return 'text-green-700 bg-green-100';
    if (tier.includes('Pro')) return 'text-blue-700 bg-blue-100';
    if (tier.includes('Enterprise') || tier.includes('Kurumsal')) return 'text-purple-700 bg-purple-100';
    return 'text-gray-700 bg-gray-100';
  };

  // charts
  const barData = useMemo(
    () => segmentData.map(s => ({ name: s.segment[language], Y1: s.y1Target, Y2: s.y2Target })),
    [segmentData, language]
  );
  const pieDataY2 = useMemo(
    () => segmentData.map(s => ({ name: s.segment[language], value: Math.round(s.acvValue * s.y2Target) })),
    [segmentData, language]
  );
  const COLORS = ['#16a34a', '#2563eb', '#7e22ce'];

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden relative">
      {/* Editors */}
      {creatorMode && (
        <>
          <ContentEditor
            title="Table Header"
            data={[{ id: 'table_header', title: tableTitle, subtitle: tableSubtitle }]}
            onSave={(newData) => {
              setTableTitle(newData[0].title);
              setTableSubtitle(newData[0].subtitle);
            }}
            className="absolute top-2 right-2 z-20"
            type="text"
            fields={[
              { key: 'title', label: 'Table Title', type: 'text', multilingual: true },
              { key: 'subtitle', label: 'Table Subtitle', type: 'textarea', multilingual: true }
            ]}
          />
          <ContentEditor
            title="Segment Data"
            data={segmentData}
            onSave={setSegmentData}
            className="absolute top-2 left-2 z-20"
            type="table"
            fields={[
              { key: 'segment', label: 'Segment', type: 'text', multilingual: true },
              { key: 'description', label: 'Description', type: 'text', multilingual: true },
              { key: 'acvStr', label: 'ACV (display)', type: 'text' },
              { key: 'acvValue', label: 'ACV (number)', type: 'number' },
              { key: 'salesCycle', label: 'Sales Cycle', type: 'text', multilingual: true },
              { key: 'implementation', label: 'Implementation', type: 'text', multilingual: true },
              { key: 'deployment', label: 'Deployment', type: 'text', multilingual: true },
              { key: 'tier', label: 'Tier', type: 'text', multilingual: true },
              { key: 'cacPayback', label: 'CAC Payback', type: 'text', multilingual: true },
              { key: 'y1Target', label: 'Y1 Target', type: 'number' },
              { key: 'y2Target', label: 'Y2 Target', type: 'number' }
            ]}
          />
        </>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">{tableTitle[language]}</h3>
        <p className="text-green-100 text-sm">{tableSubtitle[language]}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header.key}
                  className={`px-3 py-3 text-left text-xs font-semibold text-gray-700 border-r border-gray-200 ${header.width} ${index === 0 ? 'bg-gray-50' : ''}`}
                >
                  {header.label[language]}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {segmentData.map((row) => {
              const arrY1 = row.acvValue * (row.y1Target || 0);
              const arrY2 = row.acvValue * (row.y2Target || 0);

              // ↓↓↓ STATIC DISPLAY OVERRIDE (does not change calculations) ↓↓↓
              const arrY2Display =
                row.key === 'basic' ? '$1190K'
                : row.key === 'enterprise' ? '$422K'
                : fmtMoney(arrY2);
              // ↑↑↑ STATIC DISPLAY OVERRIDE ↑↑↑

              return (
                <tr key={row.key} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-3 py-4 border-r border-gray-200">
                    <div className="font-semibold text-gray-900">{row.segment[language]}</div>
                    <div className="text-xs text-gray-600">{row.description[language]}</div>
                  </td>
                  <td className="px-3 py-4 text-center font-bold text-green-700 border-r border-gray-200">
                    {row.acvStr}
                  </td>
                  <td className="px-3 py-4 text-center text-gray-700 border-r border-gray-200 text-sm">
                    {row.salesCycle[language]}
                  </td>
                  <td className="px-3 py-4 text-center text-gray-700 border-r border-gray-200 text-sm">
                    {row.implementation[language]}
                  </td>
                  <td className="px-3 py-4 text-center text-gray-700 border-r border-gray-200 text-sm">
                    {row.deployment[language]}
                  </td>
                  <td className="px-3 py-4 text-center border-r border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(row.tier[language])}`}>
                      {row.tier[language]}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center text-gray-700 border-r border-gray-200 text-sm">
                    {row.cacPayback[language]}
                  </td>
                  <td className="px-3 py-4 text-center font-bold text-blue-700 border-r border-gray-200">
                    {row.y1Target}
                  </td>
                  <td className="px-3 py-4 text-center font-bold text-blue-700 border-r border-gray-200">
                    {row.y2Target}
                  </td>
                  <td className="px-3 py-4 text-center font-bold text-blue-700 border-r border-gray-200">
                    {row.y2Target}
                  </td>
                  <td className="px-3 py-4 text-center font-bold text-purple-700 border-r border-gray-200">
                    {fmtMoney(arrY1)}
                  </td>
                  <td className="px-3 py-4 text-center font-bold text-purple-700">
                    {arrY2Display}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Totals */}
          <tfoot className="bg-blue-100 border-t-2 border-blue-200">
            <tr>
              <td className="px-3 py-3 font-bold text-gray-900 bg-blue-50 border-r border-blue-200">
                {language === 'en' ? 'Total Year 1 (Sep-25 → Aug-26)' : 'Toplam 1. Yıl (Eyl-25 → Ağu-26)'}
              </td>
              <td className="px-3 py-3 text-center font-bold text-green-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center border-r border-blue-200">{language === 'en' ? 'Mixed' : 'Karışık'}</td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center font-bold text-blue-700 border-r border-blue-200">
                {totals.sumY1Cust}
              </td>
              <td className="px-3 py-3 text-center font-bold text-blue-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center font-bold text-blue-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center font-bold text-purple-700 border-r border-blue-200">
                {fmtMoney(totals.arrY1)} {/* true numeric */}
              </td>
              <td className="px-3 py-3 text-center font-bold text-purple-700">—</td>
            </tr>

            <tr>
              <td className="px-3 py-3 font-bold text-gray-900 bg-blue-50 border-r border-blue-200">
                {language === 'en' ? 'Total Year 2 (Sep-26 → Aug-27)' : 'Toplam 2. Yıl (Eyl-26 → Ağu-27)'}
              </td>
              <td className="px-3 py-3 text-center font-bold text-green-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center border-r border-blue-200">{language === 'en' ? 'Mixed' : 'Karışık'}</td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center font-bold text-blue-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center font-bold text-blue-700 border-r border-blue-200">
                {totals.sumY2Cust}
              </td>
              <td className="px-3 py-3 text-center font-bold text-blue-700 border-r border-blue-200">
                {totals.sumY2Cust}
              </td>
              <td className="px-3 py-3 text-center font-bold text-purple-700 border-r border-blue-200">—</td>
              <td className="px-3 py-3 text-center font-bold text-purple-700">
                {fmtMoney(totals.arrY2)} {/* true numeric */}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Cards */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600">{language === 'en' ? 'Y1 Customers' : 'Y1 Müşteri'}</div>
            <div className="font-bold text-blue-700">{totals.sumY1Cust}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">{language === 'en' ? 'Y1 ARR (Run-rate)' : 'Y1 ARR (Koşu hızı)'}</div>
            <div className="font-bold text-purple-700">{fmtMoney(totals.arrY1)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">{language === 'en' ? 'Y2 Customers (End 24M)' : 'Y2 Müşteri (24 Ay Sonu)'}</div>
            <div className="font-bold text-blue-700">{totals.sumY2Cust}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">{language === 'en' ? 'Y2 ARR (Run-rate)' : 'Y2 ARR (Koşu hızı)'}</div>
            <div className="font-bold text-purple-700">{fmtMoney(totals.arrY2)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">{language === 'en' ? 'Weighted ACV (Y2 End)' : 'Ağırlıklı ACV (Y2 Sonu)'}</div>
            <div className="font-bold text-green-700">{fmtMoney(totals.weightedACV_Y2)}</div>
          </div>
        </div>
        <div className="mt-3 text-center text-xs text-gray-600">
          {language === 'en'
            ? `Blended sales cycle (Y2 mix): ~${Math.round(totals.blendedWeeks_Y2)} weeks`
            : `Karışık satış döngüsü (Y2 karışımı): ~${Math.round(totals.blendedWeeks_Y2)} hafta`}
        </div>
      </div>

      {/* Charts */}
      <div className="px-6 py-6 border-t bg-white">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">
          {language === 'en' ? '24-Month Segment Charts' : '24 Aylık Segment Grafikleri'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-2">
              {language === 'en' ? 'Customers by Segment (Y1 vs Y2)' : 'Segmente Göre Müşteri (Y1 vs Y2)'}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Y1" name={language === 'en' ? 'Y1' : 'Y1'} fill={COLORS[0]} />
                <Bar dataKey="Y2" name={language === 'en' ? 'Y2' : 'Y2'} fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-2">
              {language === 'en' ? 'ARR by Segment (End of Y2)' : 'Segmente Göre ARR (Y2 Sonu)'}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieDataY2} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {pieDataY2.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtMoney(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </Card>
  );
}
