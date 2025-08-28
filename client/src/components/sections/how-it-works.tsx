import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useMemo, useState } from 'react';

// ✅ only widely available lucide icons
import {
  Database, FileText, Image, Video, Cpu, Search, Settings, Shield, BarChart3, ArrowDown, Zap,
  Mic, Activity, Mail, Server, ScanText, Layout, Frame, Scan, Tags, Users,
  Hexagon, Info, Boxes, GitBranch, List, Gavel, History, FileSearch,
  CheckSquare, ShieldCheck, Route, FileCheck, Archive, Play
} from 'lucide-react';

const howItWorks = presentationData.howItWorks;

type LocalLayer = {
  layer: { en: string; tr: string };
  components: Array<{
    id: string;
    name: string | { en: string; tr: string };
    icon: string;
    description?: { en: string; tr: string };
  }>;
};

// --- Icon map (safe imports only) ---
const ICONS: Record<string, JSX.Element> = {
  database: <Database className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  'file-text': <FileText className="w-6 h-6" />,
  image: <Image className="w-6 h-6" />,
  video: <Video className="w-6 h-6" />,
  mic: <Mic className="w-6 h-6" />,
  activity: <Activity className="w-6 h-6" />,
  mail: <Mail className="w-6 h-6" />,
  server: <Server className="w-6 h-6" />,
  settings: <Settings className="w-6 h-6" />,
  api: <Settings className="w-6 h-6" />,
  search: <Search className="w-6 h-6" />,
  cpu: <Cpu className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  chart: <BarChart3 className="w-6 h-6" />,
  'scan-text': <ScanText className="w-6 h-6" />,
  layout: <Layout className="w-6 h-6" />,
  frame: <Frame className="w-6 h-6" />,
  scan: <Scan className="w-6 h-6" />,
  tags: <Tags className="w-6 h-6" />,
  hexagon: <Hexagon className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />,
  boxes: <Boxes className="w-6 h-6" />,
  'git-branch': <GitBranch className="w-6 h-6" />,
  list: <List className="w-6 h-6" />,
  gavel: <Gavel className="w-6 h-6" />,
  history: <History className="w-6 h-6" />,
  timeline: <History className="w-6 h-6" />,
  'file-search': <FileSearch className="w-6 h-6" />,
  'check-square': <CheckSquare className="w-6 h-6" />,
  'shield-check': <ShieldCheck className="w-6 h-6" />,
  route: <Route className="w-6 h-6" />,
  'file-check': <FileCheck className="w-6 h-6" />,
  archive: <Archive className="w-6 h-6" />,
  play: <Play className="w-5 h-5" />,
};

const getIcon = (k: string) => ICONS[k] ?? <Database className="w-6 h-6" />;

/* ---------------------------------------------
   Pop-card (TR-only) visual samples
   --------------------------------------------- */
function SensorBars() {
  const vals = [6, 10, 9, 13, 8, 11, 15, 7, 9, 12];
  return (
    <div className="flex items-end gap-0.5 h-12">
      {vals.map((v, i) => (
        <div key={i} className="w-1.5 rounded-t bg-emerald-500/80" style={{ height: `${v * 4}px` }} />
      ))}
    </div>
  );
}

function ImageGrid() {
  return (
    <div className="grid grid-cols-3 gap-1">
      {['from-blue-200 to-purple-200','from-emerald-200 to-teal-200','from-amber-200 to-rose-200',
        'from-indigo-200 to-fuchsia-200','from-sky-200 to-cyan-200','from-gray-200 to-slate-200']
        .map((g,i)=>(
        <div key={i} className={`h-12 rounded-md bg-gradient-to-br ${g} flex items-center justify-center`}>
          <Image className="w-4 h-4 text-white/70" />
        </div>
      ))}
    </div>
  );
}

function VideoThumb() {
  return (
    <div className="relative h-20 rounded-md bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-70" />
      <div className="absolute left-2 top-2 text-[10px] text-white/80 bg-black/30 px-1.5 py-0.5 rounded">00:42</div>
      <button className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow">
          <Play className="w-4 h-4 text-gray-900" />
        </div>
      </button>
    </div>
  );
}

function MailList() {
  const rows = [
    { from: 'Satınalma', subject: 'PO#90017 teyidi', time: '09:22' },
    { from: 'Tedarikçi', subject: 'Fatura A-553 ektedir', time: '10:05' },
    { from: 'Kalite', subject: 'Hat-3 denetim notları', time: '11:31' },
  ];
  return (
    <div className="space-y-1">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between bg-slate-50 rounded px-2 py-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <div className="font-medium text-slate-800">{r.from}</div>
          </div>
          <div className="text-slate-600 truncate max-w-[120px]">{r.subject}</div>
          <div className="text-slate-400">{r.time}</div>
        </div>
      ))}
    </div>
  );
}

function MiniSQL() {
  const cells = [
    ['WO', 'Hat', 'Durum', 'Adet'],
    ['4182', '3', 'Çalışıyor', '4.200'],
    ['4183', '2', 'Beklemede', '1.150'],
  ];
  return (
    <div className="border border-slate-200 rounded-md overflow-hidden">
      {cells.map((row, i) => (
        <div key={i} className={`grid grid-cols-4 text-[11px] ${i===0 ? 'bg-slate-50 font-semibold' : ''}`}>
          {row.map((c,j)=>(
            <div key={j} className={`px-2 py-1 ${j<3 ? 'border-r border-slate-200':''}`}>{c}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function VectorChips() {
  const chips = [
    { t: 'Belge#A-553', s: 0.93 },
    { t: 'SOP-Hat3', s: 0.88 },
    { t: 'Fatura-SA90017', s: 0.86 },
  ];
  return (
    <div className="flex flex-wrap gap-1">
      {chips.map((c,i)=>(
        <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
          {c.t} <span className="text-violet-500">({c.s})</span>
        </span>
      ))}
    </div>
  );
}

function GraphChips() {
  return (
    <div className="flex flex-wrap items-center gap-1 text-[11px]">
      <span className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700">Tedarikçi</span>
      <span>→</span>
      <span className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700">Satınalma</span>
      <span>→</span>
      <span className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700">Fatura</span>
      <span className="ml-2">/</span>
      <span className="px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">Makine</span>
      <span>→</span>
      <span className="px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">Sensör</span>
      <span>→</span>
      <span className="px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">Uyarı</span>
    </div>
  );
}

function OCRBlock() {
  return (
    <pre className="text-[11px] leading-snug bg-slate-900 text-emerald-200 rounded-md p-2 overflow-x-auto">
{`Parça No: BRG-12
Miktar: 4200
Tolerans: ±0,05 mm
Son İşlem: Fosfat Kaplama`}
    </pre>
  );
}

function CaptionTags() {
  const tags = ['rulo çelik', 'yüzey çizik', 'etiket', 'palet x7'];
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t,i)=>(
        <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 border text-slate-700">
          #{t}
        </span>
      ))}
    </div>
  );
}

function KeyframesStrip() {
  return (
    <div className="flex gap-1">
      {[0,1,2].map(i=>(
        <div key={i} className="relative w-16 h-10 rounded bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-600 opacity-70" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400" style={{ width: `${50 + i*15}%` }} />
        </div>
      ))}
    </div>
  );
}

function DiarizationChips() {
  return (
    <div className="flex gap-1 flex-wrap text-[11px]">
      <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700">Konuşmacı A 00:00–00:08</span>
      <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700">Konuşmacı B 00:09–00:21</span>
      <span className="px-2 py-0.5 rounded bg-violet-50 border border-violet-200 text-violet-700">Konuşmacı A 00:22–00:31</span>
    </div>
  );
}

function VerificationList() {
  const rows = [
    { k: 'Fatura ↔ Satınalma ↔ İrsaliye', v: 'Uygun', ok: true },
    { k: 'Miktar Farkı', v: '±%1,8', ok: true },
    { k: 'Teslim Tarihi', v: 'Uyumsuz', ok: false },
  ];
  return (
    <div className="space-y-1">
      {rows.map((r,i)=>(
        <div key={i} className="text-[11px] flex items-center justify-between bg-white rounded border px-2 py-1">
          <div className="font-medium">{r.k}</div>
          <div className={`${r.ok?'text-emerald-600':'text-rose-600'} font-semibold`}>{r.v}</div>
        </div>
      ))}
    </div>
  );
}

function RiskGauge() {
  const score = 0.72;
  return (
    <div className="text-[11px]">
      <div className="mb-1 font-medium">Risk Skoru: {score}</div>
      <div className="h-2 rounded bg-slate-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-rose-500" style={{ width: `${score*100}%` }} />
      </div>
      <div className="mt-1 text-slate-500">Sebep: Tedarikçi değişimi & acil satınalma</div>
    </div>
  );
}

function OrchestratorFlow() {
  const b = (t:string)=>(
    <span className="px-2 py-0.5 rounded bg-slate-100 border text-[11px]">{t}</span>
  );
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {b('İçe Alma')} <span>→</span> {b('Ayrıştırma')} <span>→</span> {b('Doğrulama')} <span>→</span> {b('Rota/HITO')}
    </div>
  );
}

// Pop-card component
function SamplePopover({ id }: { id: string }) {
  let title = '';
  let content: JSX.Element | null = null;

  switch (id) {
    // Sources
    case 'src-erp': title = 'ERP Tablosu'; content = <MiniSQL />; break;
    case 'src-crm': title = 'CRM Kayıtları'; content = <div className="space-y-1 text-[11px]">
      <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-slate-500"/><span className="font-medium">Globex</span><span className="text-slate-500">• Aşama: Teklif</span></div>
      <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-slate-500"/><span className="font-medium">Initech</span><span className="text-slate-500">• Aşama: Görüşme</span></div>
      <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-slate-500"/><span className="font-medium">Hooli</span><span className="text-slate-500">• Aşama: Kapanış</span></div>
    </div>; break;
    case 'src-docs': title = 'Belge Türleri'; content = <div className="flex flex-wrap gap-1 text-[11px]">
      {['Fatura (PDF)','Sözleşme (DOCX)','BOM (XLSX)','Güvenlik Veri Sayfası'].map((t,i)=>(
        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border"><FileText className="w-3.5 h-3.5 inline mr-1"/>{t}</span>
      ))}
    </div>; break;
    case 'src-img': title = 'Görsel Örnekleri'; content = <ImageGrid />; break;
    case 'src-vid': title = 'Video Önizleme'; content = <VideoThumb />; break;
    case 'src-audio': title = 'Ses Kayıtları'; content = <div className="space-y-1">
      <div className="flex items-center gap-2 text-[11px]"><Mic className="w-3.5 h-3.5"/><span>Çağrı-1021 • 00:42</span></div>
      <div className="flex items-center gap-2 text-[11px]"><Mic className="w-3.5 h-3.5"/><span>Saha Notu • 01:13</span></div>
      <DiarizationChips />
    </div>; break;
    case 'src-sensor': title = 'Sensör (Hat-3)'; content = <SensorBars />; break;
    case 'src-mail': title = 'E-posta Listesi'; content = <MailList />; break;
    case 'src-db': title = 'SQL Satırları'; content = <MiniSQL />; break;
    case 'src-api': title = 'API Uç Noktaları'; content = <div className="text-[11px] space-y-1">
      <div><code>GET /api/v1/invoices</code></div>
      <div><code>POST /api/v1/verify</code></div>
      <div><code>GET /api/v1/alerts?limit=20</code></div>
    </div>; break;

    // Ingestion & Parsing
    case 'ing-ocr': title = 'OCR Çıktısı'; content = <OCRBlock />; break;
    case 'ing-layout': title = 'Yerleşim'; content = <div className="space-y-1">
      <div className="h-4 bg-slate-200 rounded" />
      <div className="h-10 bg-slate-100 rounded" />
      <div className="grid grid-cols-2 gap-1">
        <div className="h-12 bg-slate-100 rounded" />
        <div className="h-12 bg-slate-100 rounded" />
      </div>
    </div>; break;
    case 'ing-video-keyframes': title = 'Ana Kareler'; content = <KeyframesStrip />; break;
    case 'ing-vision-detect': title = 'Görsel Tespitleri'; content = <div className="space-y-1 text-[11px]">
      <div className="flex items-center gap-2"><Scan className="w-3.5 h-3.5"/><span>Defekt: Çizik • Skor 0,91</span></div>
      <div className="flex items-center gap-2"><Scan className="w-3.5 h-3.5"/><span>Nesne: Palet • Adet 7</span></div>
    </div>; break;
    case 'ing-vision-caption': title = 'Etiketler'; content = <CaptionTags />; break;
    case 'ing-asr': title = 'ASR Transkript'; content = <div className="text-[11px] space-y-1">
      <div>00:03 “B vardiyası yavaşlama bildirdi.”</div>
      <div>00:12 “Besleyici motoru kontrol edin.”</div>
    </div>; break;
    case 'ing-diar': title = 'Konuşmacı Ayrımı'; content = <DiarizationChips />; break;
    case 'ing-sensor-parse': title = 'Zaman Pencereleri'; content = <div className="text-[11px] space-y-1">
      <div>00:00–00:10 • 1s örnekleme</div>
      <div>00:10–00:20 • 1s örnekleme</div>
      <SensorBars />
    </div>; break;
    case 'ing-mail-parse': title = 'E-posta Ayrıştırma'; content = <div className="text-[11px] space-y-1">
      <div>Konu: Fatura A-553</div>
      <div>Ek: a553.pdf (128KB)</div>
      <div>Gönderen: supplier@örnek.com</div>
    </div>; break;
    case 'ing-db-cdc': title = 'CDC Değişimleri'; content = <div className="text-[11px] space-y-1">
      <div>invoices • +3</div>
      <div>work_orders • +1 −0</div>
      <div>inventory • +0 −2</div>
    </div>; break;

    // Knowledge & Control
    case 'kn-store-bucket': title = 'Depolama Kovalari'; content = <div className="text-[11px]">
      <div className="mb-1">Kullanım</div>
      <div className="h-2 rounded bg-slate-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500" style={{ width: '62%' }} />
      </div>
      <div className="mt-1 text-slate-500">62% (420 GB / 680 GB)</div>
    </div>; break;
    case 'kn-vector': title = 'Vektör Eşleşmeleri'; content = <VectorChips />; break;
    case 'kn-graph': title = 'Varlık Grafı'; content = <GraphChips />; break;
    case 'kn-kv': title = 'Anahtar/Değer'; content = <div className="text-[11px] space-y-1">
      <div>FaturaNo: A-553</div>
      <div>VergiNo: TR-998123</div>
      <div>Toplam: ₺128.400</div>
    </div>; break;
    case 'kn-policy': title = 'Politikalar'; content = <div className="text-[11px] space-y-1">
      <div>PII Maskeleme: Açık</div>
      <div>Veri Yerleşimi: EU</div>
      <div>Saklama: 36 Ay</div>
    </div>; break;
    case 'kn-lineage': title = 'Soy Geçmişi'; content = <div className="text-[11px] space-y-1">
      <div>Kaynak → OCR → Doğrulama → Rapor</div>
      <div>Adımlar izlenebilir</div>
    </div>; break;

    // Agents & Orchestration
    case 'ag-orchestrator': title = 'Akış'; content = <OrchestratorFlow />; break;
    case 'ag-doc-extract': title = 'Belge Alanları'; content = <div className="text-[11px] space-y-1">
      <div>InvoiceNo=A-553</div>
      <div>Total=₺128.400</div>
      <div>TaxID=TR-998123</div>
    </div>; break;
    case 'ag-vision': title = 'Görüş İşleme'; content = <div className="text-[11px] space-y-1">
      <div>Uygunsuz Etiket: 2</div>
      <div>Çizik: 1</div>
      <div>Eksik Palet: 0</div>
    </div>; break;
    case 'ag-asr-analytics': title = 'Konuşma Analitiği'; content = <div className="text-[11px] space-y-1">
      <div>Konu: “Besleme Sorunu” • %41</div>
      <div>Duygu: Nötr (+0,12)</div>
    </div>; break;
    case 'ag-verify': title = 'Doğrulama'; content = <VerificationList />; break;
    case 'ag-risk': title = 'Risk Skoru'; content = <RiskGauge />; break;
    case 'ag-route': title = 'Kuyruk/Onay'; content = <div className="text-[11px] space-y-1">
      <div>İstisnalar: 3</div>
      <div>Bekleyen Onay: 1</div>
      <div>Otomatik Geçiş: 12</div>
    </div>; break;
    case 'ag-generate': title = 'Çıktı Üretimi'; content = <div className="text-[11px] space-y-1">
      <div>PDF • eCTD • JSON</div>
      <div>Arşiv: 2026/08/batch-42.zip</div>
    </div>; break;

    default: return null;
  }

  return (
    <div
      className="
        pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
        w-64 rounded-xl bg-white shadow-2xl ring-1 ring-black/10 z-50
        opacity-0 group-hover:opacity-100 transition-opacity duration-150
      "
      style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.25))' }}
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="text-[11px] font-semibold text-gray-700">{title}</div>
      </div>
      <div className="p-3">{content}</div>
      {/* arrow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white ring-1 ring-black/10" />
    </div>
  );
}

/* ---------------------------------------------
   Main section (LIGHT THEME)
   --------------------------------------------- */
export function HowItWorks() {
  const { language, creatorMode } = usePresentationContext();

  const [workTitle, setWorkTitle] = useState(howItWorks.title);
  const [workSubtitle, setWorkSubtitle] = useState(howItWorks.subtitle);
  const [workLayers, setWorkLayers] = useState<LocalLayer[]>(
    howItWorks.architecture as any
  );

  // softer palettes for light backgrounds
  const palette = useMemo(
    () => [
      { bg: 'from-sky-100 via-sky-50 to-blue-50', ring: 'ring-sky-200/60' },
      { bg: 'from-emerald-100 via-teal-50 to-emerald-50', ring: 'ring-emerald-200/60' },
      { bg: 'from-indigo-100 via-violet-50 to-fuchsia-50', ring: 'ring-violet-200/60' },
      { bg: 'from-amber-100 via-orange-50 to-rose-50', ring: 'ring-amber-200/60' },
    ],
    []
  );

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-visible">
      {/* subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-sky-200/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-200/30 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Editors */}
        {creatorMode && (
          <>
            <ContentEditor
              title="How It Works Title"
              data={[{ id: 'work_title', title: workTitle, subtitle: workSubtitle }]}
              onSave={(d) => {
                setWorkTitle(d[0].title);
                setWorkSubtitle(d[0].subtitle);
              }}
              className="absolute top-4 right-4 z-20"
              type="text"
              fields={[
                { key: 'title', label: 'Title', type: 'text', multilingual: true },
                { key: 'subtitle', label: 'Subtitle', type: 'textarea', multilingual: true },
              ]}
            />
            <ContentEditor
              title="Work Layers"
              data={workLayers}
              onSave={setWorkLayers}
              className="absolute top-4 left-4 z-20"
              type="cards"
              fields={[{ key: 'layer', label: 'Layer Title', type: 'text', multilingual: true }]}
            />
          </>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-full px-4 py-2 mb-4">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-sky-700">
              {language === 'en' ? 'Powered by AI' : 'AI ile Güçlendirildi'}
            </span>
          </div>
          <h2 className="font-poppins font-extrabold text-4xl md:text-5xl text-slate-900 mb-3">
            {workTitle[language]}
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
            {workSubtitle[language]}
          </p>
        </div>

        {/* Layers */}
        <div className="space-y-10">
          {workLayers.map((layer, i) => {
            const pal = palette[i % palette.length];
            return (
              <Card
                key={i}
                className={`relative rounded-3xl p-6 md:p-8 bg-gradient-to-r ${pal.bg} ring-1 ${pal.ring} overflow-visible`}
              >
                {/* Title badge */}
                <div className="mb-6 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-slate-700 text-sm font-semibold">
                    {layer.layer[language]}
                  </span>
                </div>

                {/* Tiles with hover pop-cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {layer.components.map((c) => (
                    <div key={c.id} className="group relative">
                      <SamplePopover id={c.id} />
                      <div className="h-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4 flex flex-col items-center text-center transition-transform duration-200 group-hover:-translate-y-0.5">
                        <div className="relative mb-3">
                          <div className="absolute inset-0 blur-xl bg-gradient-to-tr from-blue-200/40 to-purple-200/40 rounded-xl" />
                          <div className="relative z-10 w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-200">
                            <span className="text-slate-700">{getIcon(c.icon)}</span>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-800">
                          {typeof c.name === 'string' ? c.name : c.name[language]}
                        </div>
                        {c.description && (
                          <div className="text-xs text-slate-600 mt-1">
                            {c.description[language]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connector */}
                {i < workLayers.length - 1 && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <ArrowDown className="w-8 h-8 text-slate-400 drop-shadow" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom note */}
        <Card className="mt-12 bg-white border border-slate-200 rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">
              {language === 'en' ? 'Full Traceability & Control' : 'Tam İzlenebilirlik ve Kontrol'}
            </h3>
          </div>
          <p className="text-slate-600 text-sm md:text-base max-w-3xl mx-auto">
            {language === 'en'
              ? 'Every data transformation is tracked, every decision is auditable, and every workflow maintains complete lineage for enterprise compliance and trust.'
              : 'Her veri dönüşümü izlenir, her karar denetlenebilir ve her iş akışı kurumsal uyum ve güven için tam soy kütüğünü korur.'}
          </p>
        </Card>
      </div>
    </section>
  );
}
