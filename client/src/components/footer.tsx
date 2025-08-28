import { usePresentationContext } from '@/contexts/presentation-context';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FileText, Images, Download, X, ArrowLeft, Languages,
  ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';

type Lang = 'tr' | 'en';
type TabKey = 'docs' | 'diagrams';
type ResourceKind = 'pdf' | 'image' | 'other';

type ResourceItem = {
  id: string;
  lang: Lang | 'both';
  tab: TabKey;
  title: string;
  subtitle?: string;
  kind: ResourceKind;
  href: string;
  downloadName?: string;
};

/* =======================
   Asset Globs (Vite)
   ======================= */

// TR documents (pdf/xls/xlsx/doc/docx)
const trDocs = import.meta.glob('/src/data/resources/turkish/*.{pdf,xls,xlsx,doc,docx}', {
  eager: true, as: 'url'
});
// EN documents
const enDocs = import.meta.glob('/src/data/resources/english/*.{pdf,xls,xlsx,doc,docx}', {
  eager: true, as: 'url'
});

// TR diagrams
const trDiagrams = import.meta.glob('/src/data/resources/turkish/diyagramlar/*.{png,jpg,jpeg}', {
  eager: true, as: 'url'
});
// EN diagrams
const enDiagrams = import.meta.glob('/src/data/resources/english/diagrams/*.{png,jpg,jpeg}', {
  eager: true, as: 'url'
});

/* Optional public fallbacks if you mirror under /public/data/** */
const PUBLIC_FALLBACKS = {
  trDocs: [
    '/data/tr/Dingle-AI-Yatirim-Sunumu.pdf',
    '/data/tr/SRS-SDD-Finance.pdf',
    '/data/tr/investment-plan-tr.xlsx'
  ],
  enDocs: [
    '/data/en/Dingle-AI-Investment-Detailed.pdf',
    '/data/en/user-stories.pdf',
    '/data/en/SRS-SDD-Finance.pdf',
    '/data/en/expense-income-investment-plan.xlsx'
  ],
  trDiagrams: [
    '/data/tr-diagrams/nasil-calisir.png',
    '/data/tr-diagrams/riskler.png'
  ],
  enDiagrams: [
    '/data/en-diagrams/1-the-problem.png',
    '/data/en-diagrams/3-how-it-works.png'
  ]
};

/* ---------- Small iFrame PDF viewer with blob fallback ---------- */
function PDFInline({ url, title }: { url: string; title: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let revoked = false;
    const run = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        const blob = await res.blob();
        const obj = URL.createObjectURL(blob);
        if (!revoked) setBlobUrl(obj);
      } catch {
        setFailed(true);
      }
    };
    run();
    return () => {
      revoked = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <p className="text-gray-600">Önizleme açılamadı. Lütfen indirin veya yeni sekmede açın.</p>
        <div className="flex gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg border text-sm inline-flex items-center gap-1"
          >
            Yeni Sekmede Aç
          </a>
          <a
            href={url}
            download={title}
            className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm"
          >
            İndir
          </a>
        </div>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Yükleniyor…
      </div>
    );
  }

  return (
    <iframe
      src={`${blobUrl}#view=FitH&toolbar=1`}
      className="w-full h-full"
      title={title}
    />
  );
}

export function Footer() {
  const { language } = usePresentationContext();
  const langDefault: Lang = language === 'tr' ? 'tr' : 'en';

  /* Footer visibility → float button + auto-open once */
  const footerRef = useRef<HTMLElement | null>(null);
  const [footerActive, setFooterActive] = useState(false);
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setFooterActive(entries[0]?.isIntersecting ?? false),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Modal/UI state */
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('docs');
  const [uiLang, setUiLang] = useState<Lang>(langDefault);
  const [preview, setPreview] = useState<ResourceItem | null>(null);

  /* Auto-open resources when footer first becomes visible */
  useEffect(() => {
    if (footerActive && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      setOpen(true);
    }
  }, [footerActive]);

  /* Build resource list */
  const resources = useMemo<ResourceItem[]>(() => {
    const list: ResourceItem[] = [];

    // TR docs
    if (Object.keys(trDocs).length) {
      Object.entries(trDocs).forEach(([p, url]) => {
        const title = p.split('/').pop() || 'Belge';
        list.push({
          id: `tr-doc-${title}`,
          lang: 'tr',
          tab: 'docs',
          title,
          subtitle: 'Belge',
          kind: title.toLowerCase().endsWith('.pdf') ? 'pdf' : 'other',
          href: url as string,
          downloadName: title
        });
      });
    } else {
      PUBLIC_FALLBACKS.trDocs.forEach((href, i) =>
        list.push({
          id: `tr-doc-fb-${i}`,
          lang: 'tr',
          tab: 'docs',
          title: href.split('/').pop() || 'Belge',
          kind: href.endsWith('.pdf') ? 'pdf' : 'other',
          href
        })
      );
    }

    // EN docs
    if (Object.keys(enDocs).length) {
      Object.entries(enDocs).forEach(([p, url]) => {
        const title = p.split('/').pop() || 'Document';
        list.push({
          id: `en-doc-${title}`,
          lang: 'en',
          tab: 'docs',
          title,
          subtitle: 'Document',
          kind: title.toLowerCase().endsWith('.pdf') ? 'pdf' : 'other',
          href: url as string,
          downloadName: title
        });
      });
    } else {
      PUBLIC_FALLBACKS.enDocs.forEach((href, i) =>
        list.push({
          id: `en-doc-fb-${i}`,
          lang: 'en',
          tab: 'docs',
          title: href.split('/').pop() || 'Document',
          kind: href.endsWith('.pdf') ? 'pdf' : 'other',
          href
        })
      );
    }

    // TR diagrams
    if (Object.keys(trDiagrams).length) {
      Object.entries(trDiagrams).forEach(([p, url]) => {
        const title = p.split('/').pop() || 'Diyagram';
        list.push({
          id: `tr-dia-${title}`,
          lang: 'tr',
          tab: 'diagrams',
          title,
          subtitle: 'Diyagram',
          kind: 'image',
          href: url as string,
          downloadName: title
        });
      });
    } else {
      PUBLIC_FALLBACKS.trDiagrams.forEach((href, i) =>
        list.push({
          id: `tr-dia-fb-${i}`,
          lang: 'tr',
          tab: 'diagrams',
          title: href.split('/').pop() || 'Diyagram',
          kind: 'image',
          href
        })
      );
    }

    // EN diagrams
    if (Object.keys(enDiagrams).length) {
      Object.entries(enDiagrams).forEach(([p, url]) => {
        const title = p.split('/').pop() || 'Diagram';
        list.push({
          id: `en-dia-${title}`,
          lang: 'en',
          tab: 'diagrams',
          title,
          subtitle: 'Diagram',
          kind: 'image',
          href: url as string,
          downloadName: title
        });
      });
    } else {
      PUBLIC_FALLBACKS.enDiagrams.forEach((href, i) =>
        list.push({
          id: `en-dia-fb-${i}`,
          lang: 'en',
          tab: 'diagrams',
          title: href.split('/').pop() || 'Diagram',
          kind: 'image',
          href
        })
      );
    }

    return list;
  }, []);

  const t = (tr: string, en: string) => (uiLang === 'tr' ? tr : en);

  /* Filtering + paging (16 per page for diagrams) */
  const filtered = useMemo(
    () => resources.filter(r => (r.lang === 'both' || r.lang === uiLang) && r.tab === activeTab),
    [resources, activeTab, uiLang]
  );

  const DIA_PAGE_SIZE = 16;
  const [diaPage, setDiaPage] = useState(0);
  useEffect(() => setDiaPage(0), [activeTab, uiLang]); // reset on tab/lang change

  const pagedItems = useMemo(() => {
    if (activeTab !== 'diagrams') return filtered;
    const start = diaPage * DIA_PAGE_SIZE;
    return filtered.slice(start, start + DIA_PAGE_SIZE);
  }, [filtered, activeTab, diaPage]);

  const totalDiaPages = activeTab === 'diagrams'
    ? Math.max(1, Math.ceil(filtered.length / DIA_PAGE_SIZE))
    : 1;

  const openPreview = (item: ResourceItem) => setPreview(item);
  const closePreview = () => setPreview(null);

  const renderPreview = (item: ResourceItem) => (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
      onClick={closePreview}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={closePreview}>
            <ArrowLeft className="w-4 h-4" />
            {t('Geri Dön', 'Go Back')}
          </Button>
        </div>
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-black/5 hover:bg-black/10"
          onClick={closePreview}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="h-full w-full">
          {item.kind === 'pdf' ? (
            <PDFInline url={item.href} title={item.title} />
          ) : item.kind === 'image' ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <img src={item.href} alt={item.title} className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-600">{t('Önizleme mevcut değil', 'No preview available')}</p>
            </div>
          )}
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-lg border text-sm inline-flex items-center gap-1"
          >
            Yeni Sekmede Aç
          </a>
          <a
            href={item.href}
            download={item.downloadName || item.title}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90"
          >
            <Download className="w-4 h-4" />
            {t('İndir', 'Download')}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Resources button – blue text on white; appears with footer */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed z-[60] bottom-6 right-6 rounded-full px-5 py-3 shadow-xl transition-all
          ${footerActive ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'}
          bg-white text-blue-600 font-semibold flex items-center gap-2`}
        aria-label={t('Kaynaklar', 'Resources')}
      >
        <FileText className="w-5 h-5" />
        {t('Kaynaklar', 'Resources')}
      </button>

      {/* Footer (single link-style button) */}
      <footer ref={footerRef} className="gradient-bg text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">h</span>
            </div>
            <h3 className="font-poppins font-bold text-2xl">Xong</h3>
          </div>

          <p className="text-lg opacity-90 mb-6">
            {language === 'en'
              ? 'Ready to transform your enterprise workflows?'
              : 'Kurumsal iş akışlarınızı dönüştürmeye hazır mısınız?'}
          </p>

          <button
            onClick={() => setOpen(true)}
            className="text-blue-300 hover:text-white font-semibold underline-offset-4 hover:underline transition"
          >
            {t('Kaynaklar (dokümanlar, diyagramlar)', 'Resources (documents, diagrams)')}
          </button>
        </div>
      </footer>

      {/* Resources Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[65] bg-black/60 flex items-end md:items-center justify-center p-0 md:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full md:max-w-6xl bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">{t('Kaynaklar', 'Resources')}</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUiLang(prev => (prev === 'tr' ? 'en' : 'tr'))}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
                  title={t('Dili Değiştir', 'Toggle Language')}
                >
                  <Languages className="w-4 h-4" />
                  {uiLang === 'tr' ? 'TR' : 'EN'}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 md:px-6 pt-3">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('docs')}
                  className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    activeTab === 'docs' ? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {t('Dokümanlar', 'Documents')}
                </button>
                <button
                  onClick={() => setActiveTab('diagrams')}
                  className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    activeTab === 'diagrams' ? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  <Images className="w-4 h-4" />
                  {t('Diyagramlar', 'Diagrams')}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 md:px-6 py-5 overflow-auto">
              {pagedItems.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  {t('Bu dil ve sekmede içerik yok.', 'No content in this language and tab.')}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {pagedItems.map(item => (
                      <div
                        key={item.id}
                        className="group border rounded-xl overflow-hidden bg-white hover:shadow-md transition cursor-pointer"
                        onClick={() => openPreview(item)}
                      >
                        <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
                          {item.kind === 'image' ? (
                            <img src={item.href} alt={item.title} className="w-full h-full object-cover" />
                          ) : item.kind === 'pdf' ? (
                            <div className="text-gray-500 text-xs">PDF Preview</div>
                          ) : (
                            <div className="text-gray-500 text-xs">{t('Dosya', 'File')}</div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="text-sm font-semibold line-clamp-1">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-xs text-gray-500">{item.subtitle}</div>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                              {uiLang.toUpperCase()}
                            </span>
                            <a
                              href={item.href}
                              download={item.downloadName || item.title}
                              onClick={(e) => e.stopPropagation()}
                              className="text-primary text-xs inline-flex items-center gap-1 hover:underline"
                              title={t('İndir', 'Download')}
                            >
                              <Download className="w-3 h-3" />
                              {t('İndir', 'Download')}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Diagrams pagination (16 per page) */}
                  {activeTab === 'diagrams' && totalDiaPages > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <button
                        disabled={diaPage === 0}
                        onClick={() => setDiaPage(p => Math.max(0, p - 1))}
                        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        {t('Önceki', 'Prev')}
                      </button>
                      <div className="text-sm text-gray-600">
                        {t('Sayfa', 'Page')} {diaPage + 1}/{totalDiaPages}
                      </div>
                      <button
                        disabled={diaPage >= totalDiaPages - 1}
                        onClick={() => setDiaPage(p => Math.min(totalDiaPages - 1, p + 1))}
                        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 flex items-center gap-1"
                      >
                        {t('Sonraki', 'Next')}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Credits */}
              <div className="mt-6 pt-4 border-t text-xs text-gray-500 flex flex-wrap items-center gap-3">
                <span className="font-semibold">{t('Açık kaynak / AI altyapıları:', 'Open-source / AI stack:')}</span>
                <span>OpenAI</span>
                <span>Replit</span>
                <span>Sora</span>
                <span>WAN-2.2</span>
                <span>FLUX</span>
                <span>OpenWebUI</span>
                <span>Hugging Face</span>
               
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview pop-card */}
      {preview && renderPreview(preview)}
    </>
  );
}
