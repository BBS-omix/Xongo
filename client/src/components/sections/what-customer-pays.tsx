import { useMemo, useState } from "react";
import { usePresentationContext } from "@/contexts/presentation-context";
import { ContentEditor } from "@/components/creator/content-editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Cloud, Server, Shield, DollarSign, Gauge, FileText, Image as ImageIcon,
  MessageSquare, Layers, Factory, Receipt, Wrench, Wand2, Cog, ArrowLeft,
  ChevronDown, ChevronRight
} from "lucide-react";

/* -------------------------------------------------------------
   Helpers
------------------------------------------------------------- */
type Lang = "tr" | "en";
const T = (l: Lang, tr: string, en: string) => (l === "tr" ? tr : en);
const money = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 ? 2 : 0)}K` : `$${n.toFixed(n < 10 ? 2 : 0)}`;
const fmt = (lang: Lang, n: number) =>
  n.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 2 });

/* We price ~30% above blended market averages */
const PREMIUM = 1.3;

/* USB Certification assets (tries a few common places; falls back to /usb-logo.png) */
const usbLogoGlobs = {
  a: import.meta.glob("/src/**/usb-logo.png", { eager: true, as: "url" }),
  b: import.meta.glob("/public/**/usb-logo.png", { eager: true, as: "url" }),
  c: import.meta.glob("/src/data/**/usb-logo.png", { eager: true, as: "url" }),
};
const USB_LOGO_URL: string =
  (Object.values(usbLogoGlobs.a)[0] as string | undefined) ||
  (Object.values(usbLogoGlobs.b)[0] as string | undefined) ||
  (Object.values(usbLogoGlobs.c)[0] as string | undefined) ||
  "/usb-logo.png";

/* -------------------------------------------------------------
   Content (all fields filled with concrete ranges)
------------------------------------------------------------- */
const DEFAULT_HOSTING = [
  {
    id: "saas",
    icon: "cloud",
    name: { tr: "SaaS (Yönetilen)", en: "SaaS (Managed)" },
    summary: {
      tr: "AWS/Azure/GCP üzerinde yönetilen hizmet. En hızlı kurulum.",
      en: "Managed on AWS/Azure/GCP. Fastest time-to-value."
    },
    base: { min: 1500 * PREMIUM, max: 3000 * PREMIUM },
    notes: {
      tr: "Tek kiracı seçeneği, şifreli depolama ve opsiyonel VPC peering.",
      en: "Single-tenant option, encrypted storage, optional VPC peering."
    }
  },
  {
    id: "self",
    icon: "server",
    name: { tr: "Yerinde (Self-Hosted)", en: "Self-Hosted" },
    summary: {
      tr: "Kendi bulutunuzda/VM’lerinizde çalışır; tam veri kontrolü.",
      en: "Runs in your cloud/VMs; full data control."
    },
    base: { min: 4000 * PREMIUM, max: 8000 * PREMIUM },
    notes: {
      tr: "Kurulum ve izleme otomasyonu, güncellemeler ve SRE rehberliği.",
      en: "Install/monitoring automation, updates, and SRE guidance."
    }
  },
  {
    id: "airgap",
    icon: "shield",
    name: { tr: "Ağdan İzole (Air-Gapped)", en: "Air-Gapped" },
    summary: {
      tr: "Tam izole ağlar ve sıkı uyumluluk gereksinimleri için.",
      en: "For fully isolated networks and strict compliance."
    },
    base: { min: 10000 * PREMIUM, max: 25000 * PREMIUM },
    notes: {
      tr: "Offline paketleme, imzalı güncellemeler, sahada devreye alma.",
      en: "Offline packaging, signed updates, on-site enablement."
    }
  }
];

const DEFAULT_TIERS = [
  {
    id: "starter",
    accent: "blue",
    name: { tr: "Başlangıç", en: "Starter" },
    base: { min: 1500 * PREMIUM, max: 3000 * PREMIUM },
    includes: {
      tr: "2 ajan, temel bağlayıcılar, standart destek",
      en: "2 agents, core connectors, standard support"
    }
  },
  {
    id: "pro",
    accent: "purple",
    name: { tr: "Pro", en: "Pro" },
    base: { min: 4000 * PREMIUM, max: 8000 * PREMIUM },
    includes: {
      tr: "5 ajan, orkestratör stüdyosu, artan kota, iş saatleri desteği",
      en: "5 agents, orchestrator studio, higher quotas, business-hours support"
    }
  },
  {
    id: "enterprise",
    accent: "slate",
    name: { tr: "Kurumsal", en: "Enterprise" },
    base: { min: 10000 * PREMIUM, max: 250000 * PREMIUM },
    includes: {
      tr: "Sınırsız/özel ajanlar, gelişmiş güvenlik, tahsisli danışman",
      en: "Unlimited/custom agents, advanced security, dedicated advisor"
    }
  }
];

const DEFAULT_METERS = [
  {
    id: "tokens",
    icon: "gauge",
    name: { tr: "LLM Tokenları", en: "LLM Tokens" },
    unit: { tr: "1M token", en: "1M tokens" },
    price: { min: 3 * PREMIUM, max: 12 * PREMIUM },
    note: {
      tr: "Model/bölge ve giriş/çıkış farkına göre değişir.",
      en: "Varies by model/region and input/output mix."
    }
  },
  {
    id: "pages",
    icon: "file",
    name: { tr: "Belge Sayfaları", en: "Document Pages" },
    unit: { tr: "1 sayfa", en: "per page" },
    price: { min: 0.01 * PREMIUM, max: 0.03 * PREMIUM },
    note: {
      tr: "OCR + ayrıştırma maliyeti (kv/tablolar dahil).",
      en: "OCR + parsing (incl. key-value/tables)."
    }
  },
  {
    id: "images",
    icon: "image",
    name: { tr: "Görseller", en: "Images" },
    unit: { tr: "adet", en: "each" },
    price: { min: 0.001 * PREMIUM, max: 0.01 * PREMIUM },
    note: {
      tr: "Sınıflandırma/caption/tespit gibi hafif işlemler.",
      en: "Light classify/caption/detection workloads."
    }
  },
  {
    id: "tickets",
    icon: "message",
    name: { tr: "Ticket/İş Akışı", en: "Tickets/Workflows" },
    unit: { tr: "adet", en: "each" },
    price: { min: 0.01 * PREMIUM, max: 0.05 * PREMIUM },
    note: {
      tr: "Yönlendirme, onay, otomatik çözüm (n8n/Queue benzeri).",
      en: "Routing, approvals, auto-resolution (n8n/Queue-like)."
    }
  },
  {
    id: "storage",
    icon: "layers",
    name: { tr: "Depolama", en: "Storage" },
    unit: { tr: "GB/ay", en: "GB/mo" },
    price: { min: 0.02 * PREMIUM, max: 0.08 * PREMIUM },
    note: {
      tr: "Vektör + obje depolama (pgvector/Pinecone + S3).",
      en: "Vector + object storage (pgvector/Pinecone + S3)."
    }
  }
];

const DEFAULT_FINE_TUNE = [
  {
    id: "hosted-ft",
    badge: "FT",
    name: { tr: "Barındırılan İnce Ayar", en: "Hosted Fine-Tuning" },
    summary: {
      tr: "7B–13B açık ağırlık modelleri için yönetilen fine-tune.",
      en: "Managed fine-tuning for 7B–13B open-weight models."
    },
    setup: { min: 3000 * PREMIUM, max: 12000 * PREMIUM },
    trainStep: { min: 0.25 * PREMIUM, max: 1.2 * PREMIUM },
    serve: { min: 1500 * PREMIUM, max: 6000 * PREMIUM }
  },
  {
    id: "private-model",
    badge: "PM",
    name: { tr: "Özel / Kapalı Model", en: "Private / Custom Model" },
    summary: {
      tr: "Uyarlanmış kurumsal model pipeline’ı, güvenlik ve SLO’lar.",
      en: "Tailored enterprise model pipeline, security and SLOs."
    },
    setup: { min: 15000 * PREMIUM, max: 90000 * PREMIUM },
    trainStep: { min: 1.0 * PREMIUM, max: 4.0 * PREMIUM },
    serve: { min: 6000 * PREMIUM, max: 30000 * PREMIUM }
  }
];

const DEFAULT_STORIES = [
  {
    id: "ap-invoice",
    icon: "receipt",
    name: { tr: "Satın Alma Faturaları", en: "AP Invoices" },
    assumptions: {
      tr: "Ayda 40K sayfa, 10M token I/O, 10K ticket.",
      en: "40K pages/mo, 10M tokens I/O, 10K tickets."
    },
    estimate: { min: 4500 * PREMIUM, max: 9000 * PREMIUM }
  },
  {
    id: "field-qa",
    icon: "factory",
    name: { tr: "Saha Görsel Denetimi", en: "Field Visual QA" },
    assumptions: {
      tr: "Ayda 1M görsel, hafif caption + tespit.",
      en: "1M images/mo, light caption + detection."
    },
    estimate: { min: 6000 * PREMIUM, max: 12000 * PREMIUM }
  },
  {
    id: "support-triage",
    icon: "message",
    name: { tr: "Destek Triage", en: "Support Triage" },
    assumptions: {
      tr: "Ayda 80K ticket, 15M token I/O.",
      en: "80K tickets/mo, 15M tokens I/O."
    },
    estimate: { min: 3500 * PREMIUM, max: 8000 * PREMIUM }
  },
  {
    id: "maintenance",
    icon: "wrench",
    name: { tr: "Bakım & Arıza Tahmini", en: "Maintenance & Fault" },
    assumptions: {
      tr: "Ayda 150K iş emri, 8M token I/O, 5 TB vektör.",
      en: "150K work orders/mo, 8M tokens I/O, 5 TB vectors."
    },
    estimate: { min: 7000 * PREMIUM, max: 15000 * PREMIUM }
  }
];

/* Deployment (infra/ops) by tier — concrete ranges, +30%) */
const DEPLOYMENT_MATRIX = [
  {
    id: "aws",
    icon: "cloud",
    name: { tr: "AWS (Yönetilen)", en: "AWS (Managed)" },
    monthlyByTier: {
      starter:    { min: 2000 * PREMIUM, max: 2000 * PREMIUM },
      pro:        { min: 5000 * PREMIUM, max: 8000 * PREMIUM },
      enterprise: { min: 20000 * PREMIUM, max: 40000 * PREMIUM }
    },
    note: {
      tr: "Kurumsalda ayrılmış/yerinde dağıtımı tavsiye ederiz.",
      en: "For Enterprise we recommend dedicated/self-hosted."
    }
  },
  {
    id: "self",
    icon: "server",
    name: { tr: "Yerinde / Kendi Bulutunuz", en: "Self-Hosted / Your Cloud" },
    monthlyByTier: {
      starter:    { min: 3000 * PREMIUM, max: 6000 * PREMIUM },
      pro:        { min: 7000 * PREMIUM, max: 12000 * PREMIUM },
      enterprise: { min: 25000 * PREMIUM, max: 60000 * PREMIUM }
    },
    note: {
      tr: "VPC/K8s, izleme, yedekleme ve temel SRE çalışma saatleri.",
      en: "VPC/K8s, monitoring, backups and baseline SRE hours."
    }
  },
  {
    id: "airgap",
    icon: "shield",
    name: { tr: "Ağdan İzole (Air-Gapped)", en: "Air-Gapped" },
    monthlyByTier: {
      starter:    { min: 10000 * PREMIUM, max: 15000 * PREMIUM },
      pro:        { min: 15000 * PREMIUM, max: 25000 * PREMIUM },
      enterprise: { min: 30000 * PREMIUM, max: 80000 * PREMIUM }
    },
    note: {
      tr: "Offline güncellemeler ve sahada devreye alma dahil.",
      en: "Includes offline updates and on-site enablement."
    }
  }
];

/* Icons */
const ICON = {
  cloud: <Cloud className="w-5 h-5" />,
  server: <Server className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  dollar: <DollarSign className="w-5 h-5" />,
  gauge: <Gauge className="w-5 h-5" />,
  file: <FileText className="w-5 h-5" />,
  image: <ImageIcon className="w-5 h-5" />,
  message: <MessageSquare className="w-5 h-5" />,
  layers: <Layers className="w-5 h-5" />,
  factory: <Factory className="w-5 h-5" />,
  receipt: <Receipt className="w-5 h-5" />,
  wrench: <Wrench className="w-5 h-5" />,
  wand: <Wand2 className="w-5 h-5" />,
  cog: <Cog className="w-5 h-5" />
} as const;

const Pill = ({ children, tone = "sky" }: { children: React.ReactNode; tone?: "sky"|"slate"|"violet"|"amber"|"emerald" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border bg-white text-${tone}-700 border-${tone}-200`}>
    {children}
  </span>
);

/* -------------------------------------------------------------
   USB Resource Calculations (from Excel)
------------------------------------------------------------- */
type ResourceUnit = "rows" | "pages" | "gb" | "users" | "count";
type USBItem = {
  key: string;
  label: string;
  desc: string;
  total: number | null;
  monthly: number | null;
  unit: ResourceUnit;
};

const USB_GROUPS: Array<{ id: string; title: string; items: USBItem[] }> = [
  {
    id: "hammadde",
    title: "Hammadde Sertifikaları",
    items: [
      { key:"hammaddesertifikalar", label:"Hammadde Sertifikalar", desc:"Her bir hammadde sertifikasının kaydını tutan ana tablo", total: 35869, monthly: 4483.63, unit:"rows" },
      { key:"hammaddesertifikalar_tasimabelgeleri", label:"Taşıma Belgeleri", desc:"Hammaddelerdeki taşıma belgelerini tutan alt tablo (Tablo 9)", total: 95346, monthly: 11918.25, unit:"rows" },
      { key:"hammaddesertifikalar_urunler", label:"Ürün Belgeleri", desc:"Hammaddelerdeki ürün belgeleri alt tablo (Tablo 10)", total: 122733, monthly: 15341.63, unit:"rows" },
      { key:"hammaddesertifikalar_mensei", label:"Menşei Belgeleri", desc:"Hammaddelerdeki menşei belgeleri alt tablo (Tablo 11)", total: 45126, monthly: 5640.75, unit:"rows" },
      { key:"hammadde_pdf_pages", label:"Hammadde Sertifika PDF'i (Sayfa)", desc:"Yaklaşık sayfa sayısı", total: 17000, monthly: 2125, unit:"pages" },
      { key:"hammadde_pdf_gb", label:"Hammadde Sertifika PDF'i (GB)", desc:"Yaklaşık boyut", total: 35, monthly: 4.38, unit:"gb" },
      { key:"hammadde_validator_docs_gb", label:"Hammadde Doğrulayıcı Dokümanlar (GB)", desc:"Yaklaşık boyut", total: 80, monthly: 10, unit:"gb" },
      { key:"hammadde_users", label:"Temaslı Kullanıcı", desc:"Sürece temas eden kullanıcı sayısı", total: 25, monthly: 25, unit:"users" },
    ]
  },
  {
    id: "denetim",
    title: "Denetim Raporu",
    items: [
      { key:"denetimraporu", label:"Denetim Raporu", desc:"Her bir hammadde denetim raporunun kaydı", total: 8070, monthly: 1008.75, unit:"rows" },
      { key:"denetimraporusertifikasyonkarari", label:"Sertifikasyon Kararı", desc:"Denetim raporunun sertifikasyon kararı sayısı", total: 15333, monthly: 1916.63, unit:"rows" },
      { key:"gozden_gecirme_kriterleri", label:"Gözden Geçirme Kriterleri", desc:"Gözden geçirme soru sayısı", total: 60000, monthly: 7500, unit:"rows" },
      { key:"denetim_uygunsuzluk", label:"Uygunsuzluk (Majör/Minör)", desc:"Uygunsuzluk sayısı", total: 800, monthly: 100, unit:"rows" },
      { key:"denetim_users", label:"Temaslı Kullanıcı", desc:"Sürece temas eden kullanıcı sayısı", total: 15, monthly: 15, unit:"users" },
    ]
  },
  {
    id: "sertifika",
    title: "Sertifika",
    items: [
      { key:"sertifikadongu", label:"Sertifika Döngü", desc:"Yayınlanan sertifika sayısı", total: 3660, monthly: 457.5, unit:"rows" },
      { key:"sertifika_uniteler", label:"Sertifika Üniteler", desc:"Sertifikada yer alan ünite sayısı", total: 94602, monthly: 11825.25, unit:"rows" },
      { key:"sertifika_urunler", label:"Sertifika Ürünler", desc:"Sertifikada yer alan ürün sayısı", total: 1769225, monthly: 221153.13, unit:"rows" },
      { key:"sertifika_revizyon", label:"Sertifika Revizyon", desc:"Revizyon sayısı", total: 16975, monthly: 2121.88, unit:"rows" },
      { key:"sertifika_users", label:"Temaslı Kullanıcı", desc:"Sürece temas eden kullanıcı sayısı", total: 15, monthly: 15, unit:"users" },
    ]
  },
  {
    id: "satis",
    title: "Satış Sertifikaları",
    items: [
      { key:"satissertifikalar", label:"TC", desc:"TC sayısı", total: 64462, monthly: 8057.75, unit:"rows" },
      { key:"satissertifikalar_urunler", label:"TC Ürünler", desc:"TC ürünleri", total: 236158, monthly: 29519.75, unit:"rows" },
      { key:"satissertifikalar_tasimabelgeleri", label:"TC Taşıma Belgeleri", desc:"TC taşıma belgeleri", total: 163990, monthly: 20498.75, unit:"rows" },
      { key:"satissertifikalar_tasimabelgeleri_faturalar", label:"TC Faturalar", desc:"TC faturalar", total: 169255, monthly: 21156.88, unit:"rows" },
      { key:"satis_users", label:"Temaslı Kullanıcı", desc:"Sürece temas eden kullanıcı sayısı", total: 120, monthly: 120, unit:"users" },
    ]
  },
];

/* Utility to compute totals for a group */
function computeTotals(items: USBItem[]) {
  return items.reduce(
    (acc, it) => {
      if (it.total != null) {
        if (it.unit === "rows") acc.rowsTotal += it.total;
        if (it.unit === "pages") acc.pagesTotal += it.total;
        if (it.unit === "gb") acc.gbTotal += it.total;
        if (it.unit === "users") acc.usersTotal += it.total;
      }
      if (it.monthly != null) {
        if (it.unit === "rows") acc.rowsMonthly += it.monthly;
        if (it.unit === "pages") acc.pagesMonthly += it.monthly;
        if (it.unit === "gb") acc.gbMonthly += it.monthly;
        if (it.unit === "users") acc.usersMonthly += it.monthly;
      }
      return acc;
    },
    { rowsTotal:0, rowsMonthly:0, pagesTotal:0, pagesMonthly:0, gbTotal:0, gbMonthly:0, usersTotal:0, usersMonthly:0 }
  );
}

/* -------------------------------------------------------------
   Component
------------------------------------------------------------- */
export function WhatCustomerPays() {
  const { language, creatorMode } = usePresentationContext();
  const lang = language as Lang;

  const [hosting, setHosting] = useState(DEFAULT_HOSTING);
  const [tiers, setTiers] = useState(DEFAULT_TIERS);
  const [meters, setMeters] = useState(DEFAULT_METERS);
  const [fineTune, setFineTune] = useState(DEFAULT_FINE_TUNE);
  const [stories, setStories] = useState(DEFAULT_STORIES);

  const [activeHosting, setActiveHosting] = useState(hosting[0].id);
  const [view, setView] = useState<"pricing" | "pilot">("pricing");

  /* Calculator state (general) */
  const [calc, setCalc] = useState({
    tier: "starter",
    deploy: "aws" as "aws" | "self" | "airgap",
    tokensM: 10,
    pages: 10000,
    images: 10000,
    tickets: 5000,
    storageGB: 200
  });

  /* Pilot USB: inputs (fixed to enterprise; selector removed) */
  const [pilot, setPilot] = useState({
    deployment: "aws" as "aws" | "local",
    users: 120,
    localMonthlyOps: 4000, // adjustable working expenses for local
    tokensM: 20,
    pages: 50000,
    images: 20000,
    tickets: 15000,
    storageGB: 2000,
    tier: "enterprise" as "enterprise", // fixed; no UI to change
    /* NEW: Optional fine-tuning one-time addition */
    includeFT: false,
    ftId: "hosted-ft" as "hosted-ft" | "private-model",
  });

  /* Expandable state for resource cards */
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(USB_GROUPS.map(g => [g.id, true]))
  );

  /* Precomputed summaries (used both in left pane and cards header) */
  const usbSummaries = useMemo(() => {
    return USB_GROUPS.map(g => ({ id: g.id, title: g.title, totals: computeTotals(g.items) }));
  }, []);

  const currentTier = useMemo(
    () => tiers.find((t) => t.id === calc.tier) ?? tiers[0],
    [tiers, calc.tier]
  );

  const deployDef = useMemo(
    () => DEPLOYMENT_MATRIX.find(d => d.id === calc.deploy) ?? DEPLOYMENT_MATRIX[0],
    [calc.deploy]
  );

  const deployCost = deployDef.monthlyByTier[calc.tier as "starter" | "pro" | "enterprise"];

  const tokenMeter = meters.find((m) => m.id === "tokens")!;
  const pagesMeter = meters.find((m) => m.id === "pages")!;
  const imageMeter = meters.find((m) => m.id === "images")!;
  const ticketsMeter = meters.find((m) => m.id === "tickets")!;
  const storageMeter = meters.find((m) => m.id === "storage")!;

  const calcRange = useMemo(() => {
    const baseMid = (currentTier.base.min + currentTier.base.max) / 2;

    const tokensMin = calc.tokensM * tokenMeter.price.min;
    const tokensMax = calc.tokensM * tokenMeter.price.max;
    const pagesMin = calc.pages * pagesMeter.price.min;
    const pagesMax = calc.pages * pagesMeter.price.max;
    const imgMin = calc.images * imageMeter.price.min;
    const imgMax = calc.images * imageMeter.price.max;
    const tktMin = calc.tickets * ticketsMeter.price.min;
    const tktMax = calc.tickets * ticketsMeter.price.max;
    const stgMin = calc.storageGB * storageMeter.price.min;
    const stgMax = calc.storageGB * storageMeter.price.max;

    const infraMin = deployCost.min;
    const infraMax = deployCost.max;

    const min = Math.round(baseMid + tokensMin + pagesMin + imgMin + tktMin + stgMin + infraMin);
    const max = Math.round(baseMid + tokensMax + pagesMax + imgMax + tktMax + stgMax + infraMax);
    return { min, max };
  }, [
    calc, currentTier,
    tokenMeter, pagesMeter, imageMeter, ticketsMeter, storageMeter,
    deployCost
  ]);

  /* Pilot calculation (USB Certification – numbers fixed per brief) */
  const pilotComputed = useMemo(() => {
    // Client figures:
    const chatCredits = 0; // USD / mo (hidden in UI)
    const xongMonthlyBracket = { min: 15000, max: 25000 };
    const awsMonthly = { min: 20000, max: 30000 };
    const localUpfront = { min: 70000, max: 100000 };
    const localMonthlyOps = pilot.localMonthlyOps;
    const trainingUpfront = { min: 24000, max: 40000 };

    // Optional Fine-tuning (one-time setup only)
    const ftDef = DEFAULT_FINE_TUNE.find(f => f.id === pilot.ftId)!;
    const ftUpfront = pilot.includeFT
      ? { min: ftDef.setup.min, max: ftDef.setup.max }
      : { min: 0, max: 0 };

    // Subscription tier midpoint (transparency)
    const tierDef = DEFAULT_TIERS.find(t => t.id === "enterprise")!;
    const subMid = (tierDef.base.min + tierDef.base.max) / 2;

    // Usage transparency (from meters)
    const usageMin =
      pilot.tokensM * tokenMeter.price.min +
      pilot.pages * pagesMeter.price.min +
      pilot.images * imageMeter.price.min +
      pilot.tickets * ticketsMeter.price.min +
      pilot.storageGB * storageMeter.price.min;
    const usageMax =
      pilot.tokensM * tokenMeter.price.max +
      pilot.pages * pagesMeter.price.max +
      pilot.images * imageMeter.price.max +
      pilot.tickets * ticketsMeter.price.max +
      pilot.storageGB * storageMeter.price.max;

    // Monthly scenarios
    const monthlyAWS = {
      min: xongMonthlyBracket.min + awsMonthly.min,
      max: xongMonthlyBracket.max + awsMonthly.max
    };
    const monthlyLocal = {
      min: xongMonthlyBracket.min + localMonthlyOps + chatCredits,
      max: xongMonthlyBracket.max + localMonthlyOps + chatCredits
    };

    // Upfront scenarios (+ optional FT)
    const upfrontAWS = {
      min: trainingUpfront.min + ftUpfront.min,
      max: trainingUpfront.max + ftUpfront.max
    };
    const upfrontLocal = {
      min: trainingUpfront.min + localUpfront.min + ftUpfront.min,
      max: trainingUpfront.max + localUpfront.max + ftUpfront.max
    };

    const monthly = pilot.deployment === "aws" ? monthlyAWS : monthlyLocal;
    const upfront = pilot.deployment === "aws" ? upfrontAWS : upfrontLocal;

    return {
      chatCredits,
      xongMonthlyBracket,
      awsMonthly,
      localUpfront,
      localMonthlyOps,
      trainingUpfront,
      monthly,
      upfront,
      ftUpfront,
      ftLabel: ftDef.name[lang],
      usageRange: { min: usageMin + subMid, max: usageMax + subMid },
      tierMid: subMid
    };
  }, [pilot, tokenMeter, pagesMeter, imageMeter, ticketsMeter, storageMeter, lang]);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* soft blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -left-10 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-full px-4 py-2 mb-3">
            {ICON.dollar}
            <span className="text-xs text-sky-700">
              {T(lang, "Açık, premium ve öngörülebilir maliyetleme", "Clear, premium & predictable pricing")}
            </span>
          </div>
          <h2 className="font-poppins font-extrabold text-4xl text-slate-900 mb-2">
            {T(lang, "Müşterinin Ödeyecekleri", "What the Customer Pays")}
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto mb-4">
            {T(
              lang,
              "Aylık taban + dağıtım maliyeti + kullanım ölçümleri + (opsiyonel) ince ayar/barındırma. Rakamlar küresel ortalama +%30 premium içerir. Aşağıdaki hesaplayıcı dağıtımı da kapsar; masrafları önceden öngörebilirsiniz.",
              "Monthly base + deployment + usage meters + (optional) fine-tune/serving. Figures include +30% premium over global averages. The calculator includes deployment to forecast costs upfront."
            )}
          </p>

          {/* Pilot button */}
          <div className="flex justify-center">
            <Button
              onClick={() => setView("pilot")}
              className="bg-indigo-600 hover:bg-indigo-500"
            >
              {T(lang, "Pilot Firma: USB Certification", "Pilot Firm: USB Certification")}
            </Button>
          </div>
        </div>

        {/* Sliding container */}
        <div className="relative">
          {/* MAIN PRICING VIEW */}
          <div
            className={`transition-all duration-500 ${
              view === "pricing" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none h-0 overflow-hidden"
            }`}
          >
            {/* Editors */}
            {creatorMode && (
              <div className="flex flex-wrap gap-2 mb-4">
                <ContentEditor title="Hosting Cards" data={hosting} onSave={setHosting} type="cards"
                  fields={[
                    { key: "name", label: "Name", type: "text", multilingual: true },
                    { key: "summary", label: "Summary", type: "textarea", multilingual: true },
                    { key: "notes", label: "Notes", type: "textarea", multilingual: true },
                  ]}
                  sectionKey="what_customer_pays_hosting"
                />
                <ContentEditor title="Tiers" data={tiers} onSave={setTiers} type="cards"
                  fields={[
                    { key: "name", label: "Tier Name", type: "text", multilingual: true },
                    { key: "includes", label: "Includes", type: "textarea", multilingual: true },
                  ]}
                  sectionKey="what_customer_pays_tiers"
                />
                <ContentEditor title="Meters" data={meters} onSave={setMeters} type="cards"
                  fields={[
                    { key: "name", label: "Meter Name", type: "text", multilingual: true },
                    { key: "unit", label: "Unit", type: "text", multilingual: true },
                    { key: "note", label: "Note", type: "textarea", multilingual: true },
                  ]}
                  sectionKey="what_customer_pays_meters"
                />
                <ContentEditor title="Fine-Tune" data={fineTune} onSave={setFineTune} type="cards"
                  fields={[
                    { key: "name", label: "Name", type: "text", multilingual: true },
                    { key: "summary", label: "Summary", type: "textarea", multilingual: true },
                  ]}
                  sectionKey="what_customer_pays_fine_tune"
                />
                <ContentEditor title="Stories" data={stories} onSave={setStories} type="cards"
                  fields={[
                    { key: "name", label: "Name", type: "text", multilingual: true },
                    { key: "assumptions", label: "Assumptions", type: "textarea", multilingual: true },
                  ]}
                  sectionKey="what_customer_pays_stories"
                />
              </div>
            )}

            {/* Hosting buttons */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {hosting.map((h) => {
                  const active = h.id === activeHosting;
                  const icon = h.icon === "cloud" ? ICON.cloud : h.icon === "server" ? ICON.server : ICON.shield;
                  return (
                    <button
                      key={h.id}
                      onClick={() => setActiveHosting(h.id)}
                      className={`px-4 py-2 rounded-full border text-sm inline-flex items-center gap-2 transition
                        ${active ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50 border-slate-200"}`}
                    >
                      {icon}
                      <span>{h.name[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hosting cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {hosting.map((h) => (
                <Card
                  key={h.id}
                  className={`rounded-2xl p-6 border ${h.id === activeHosting ? "border-slate-300 shadow-lg" : "border-slate-200"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {h.icon === "cloud" ? ICON.cloud : h.icon === "server" ? ICON.server : ICON.shield}
                      <h3 className="font-semibold text-slate-900">{h.name[lang]}</h3>
                    </div>
                    <Pill tone="slate">{T(lang, "Aylık Taban", "Base/mo")}</Pill>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {money(h.base.min)}–{money(h.base.max)}
                  </div>
                  <p className="text-sm text-slate-700 mb-3">{h.summary[lang]}</p>
                  <div className="text-xs text-slate-500">{h.notes[lang]}</div>
                </Card>
              ))}
            </div>

            {/* Tiers */}
            <h3 className="text-lg font-semibold text-slate-900 mb-3">{T(lang, "Abonelik Katmanları", "Subscription Tiers")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {tiers.map((t) => (
                <Card key={t.id} className="rounded-2xl p-6 border border-slate-200 bg-white/90">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full bg-${t.accent}-600 flex items-center justify-center text-white`}>
                        {ICON.cog}
                      </div>
                      <div className="font-semibold text-slate-900">{t.name[lang]}</div>
                    </div>
                    <Pill>{T(lang, "Taban", "Base")}</Pill>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-2 mb-1">
                    {money(t.base.min)}–{money(t.base.max)}
                  </div>
                  <div className="text-sm text-slate-600">{t.includes[lang]}</div>
                  {t.id === "enterprise" && (
                    <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                      {T(lang, "Öneri: Kurumsalda yerinde/ayrılmış dağıtım tercih edin.", "Recommendation: For Enterprise use dedicated/self-hosted.")}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Usage meters */}
            <h3 className="text-lg font-semibold text-slate-900 mb-3">{T(lang, "Kullanım Bazlı Ölçümler", "Usage-Based Meters")}</h3>
            <Card className="rounded-2xl p-6 border border-slate-200 mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {meters.map((m) => {
                  const ic =
                    m.icon === "gauge" ? ICON.gauge :
                    m.icon === "file" ? ICON.file :
                    m.icon === "image" ? ICON.image :
                    m.icon === "message" ? ICON.message :
                    ICON.layers;
                  return (
                    <div key={m.id} className="rounded-xl ring-1 ring-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">{ic}</div>
                        <span>{m.name[lang]}</span>
                      </div>
                      <div className="text-sm text-slate-700">
                        {money(m.price.min)}–{money(m.price.max)} / {m.unit[lang]}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{m.note[lang]}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Fine-tuning */}
            <h3 className="text-lg font-semibold text-slate-900 mb-3">{T(lang, "İnce Ayar & Özel Model", "Fine-Tuning & Private Models")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {fineTune.map((f) => (
                <Card key={f.id} className="rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center">{ICON.wand}</div>
                      <div className="font-semibold text-slate-900">{f.name[lang]}</div>
                    </div>
                    <Pill tone="violet">{f.badge}</Pill>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{f.summary[lang]}</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="text-slate-500">{T(lang, "Kurulum", "Setup")}</div>
                      <div className="font-semibold text-slate-900">{money(f.setup.min)}–{money(f.setup.max)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">{T(lang, "Eğitim Adımı (1K)", "Train Step (1K)")}</div>
                      <div className="font-semibold text-slate-900">
                        ${f.trainStep.min.toFixed(2)}–${f.trainStep.max.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">{T(lang, "Barındırma", "Serving/mo")}</div>
                      <div className="font-semibold text-slate-900">{money(f.serve.min)}–{money(f.serve.max)}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick calculator with DEPLOYMENT */}
            <h3 className="text-lg font-semibold text-slate-900 mb-3">{T(lang, "Hızlı Hesaplayıcı", "Quick Calculator")}</h3>
            <Card className="rounded-2xl p-6 border border-slate-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Controls */}
                <div className="space-y-5">
                  <div>
                    <div className="text-sm text-slate-700 mb-1">{T(lang,"Katman","Tier")}</div>
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_TIERS.map((t)=>(
                        <Button key={t.id} variant={calc.tier===t.id ? "default":"outline"}
                          className={calc.tier===t.id ? "bg-slate-900 hover:bg-slate-800" : "bg-white"}
                          onClick={()=>setCalc(s=>({ ...s, tier:t.id as "starter"|"pro"|"enterprise" }))}>
                          {t.name[lang]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-700 mb-1">{T(lang,"Dağıtım (Deploy)","Deployment")}</div>
                    <div className="flex flex-wrap gap-2">
                      {DEPLOYMENT_MATRIX.map((d)=>(
                        <Button key={d.id} variant={calc.deploy===d.id ? "default":"outline"}
                          className={calc.deploy===d.id ? "bg-indigo-600 hover:bg-indigo-500" : "bg-white"}
                          onClick={()=>setCalc(s=>({ ...s, deploy:d.id as "aws"|"self"|"airgap" }))}>
                          {d.id==="aws" ? ICON.cloud : d.id==="self" ? ICON.server : ICON.shield}
                          <span className="ml-1">{d.name[lang]}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      {deployDef.note[lang]}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { k:"tokensM", label:T(lang,"Token (M)","Tokens (M)") },
                      { k:"pages", label:T(lang,"Sayfa","Pages") },
                      { k:"images", label:T(lang,"Görsel","Images") },
                      { k:"tickets", label:T(lang,"Ticket","Tickets") },
                      { k:"storageGB", label:T(lang,"Depolama (GB)","Storage (GB)") },
                    ].map((f)=>(
                      <div key={f.k}>
                        <div className="text-xs text-slate-600 mb-1">{f.label}</div>
                        <input
                          type="number"
                          value={(calc as any)[f.k]}
                          onChange={(e)=> setCalc(s=>({ ...s, [f.k]: Math.max(0, Number(e.target.value||0)) }))}
                          className="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="lg:col-span-2">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                      <div className="text-xs text-slate-500">{T(lang,"Abonelik Tabanı","Subscription Base")}</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {money((currentTier.base.min+currentTier.base.max)/2)}
                      </div>
                      <div className="text-xs text-slate-500">{currentTier.name[lang]}</div>
                    </div>
                    <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                      <div className="text-xs text-slate-500">{T(lang,"Deploy (Altyapı/Ops)","Deployment (Infra/Ops)")}</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {money(deployCost.min)}–{money(deployCost.max)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {deployDef.name[lang]} • {T(lang,"katman bağımlı","tier-dependent")}
                      </div>
                    </div>
                    <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                      <div className="text-xs text-slate-500">LLM</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {money(calc.tokensM*tokenMeter.price.min)}–{money(calc.tokensM*tokenMeter.price.max)}
                      </div>
                      <div className="text-xs text-slate-500">{calc.tokensM}M {tokenMeter.unit[lang]}</div>
                    </div>
                    <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                      <div className="text-xs text-slate-500">{T(lang,"Belgeler","Documents")}</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {money(calc.pages*pagesMeter.price.min)}–{money(calc.pages*pagesMeter.price.max)}
                      </div>
                      <div className="text-xs text-slate-500">{calc.pages} {pagesMeter.unit[lang]}</div>
                    </div>
                    <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                      <div className="text-xs text-slate-500">{T(lang,"Görseller","Images")}</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {money(calc.images*imageMeter.price.min)}–{money(calc.images*imageMeter.price.max)}
                      </div>
                      <div className="text-xs text-slate-500">{calc.images} {imageMeter.unit[lang]}</div>
                    </div>
                    <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                      <div className="text-xs text-slate-500">{T(lang,"Ticket/İş Akışı","Tickets/Workflows")}</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {money(calc.tickets*ticketsMeter.price.min)}–{money(calc.tickets*ticketsMeter.price.max)}
                      </div>
                      <div className="text-xs text-slate-500">{calc.tickets} {ticketsMeter.unit[lang]}</div>
                    </div>
                    <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                      <div className="text-xs text-slate-500">{T(lang,"Depolama","Storage")}</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {money(calc.storageGB*storageMeter.price.min)}–{money(calc.storageGB*storageMeter.price.max)}
                      </div>
                      <div className="text-xs text-slate-500">{calc.storageGB} {storageMeter.unit[lang]}</div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <div className="text-sm/5 opacity-90">{T(lang,"Tahmini Toplam (aylık)","Estimated Total (monthly)")}</div>
                      <div className="text-2xl font-extrabold">{money(calcRange.min)}–{money(calcRange.max)}</div>
                    </div>
                    <div className="text-xs opacity-90 max-w-xl">
                      {T(
                        lang,
                        "Not: Bölge, güvenlik ve model seçimi değişkendir. Kurumsal müşteriler için ayrılmış/yerinde mimari önerilir.",
                        "Note: Region, security and model choices vary. For Enterprise we recommend dedicated/self-hosted."
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stories */}
            <h3 className="text-lg font-semibold text-slate-900 mb-3">{T(lang,"Örnek Kullanım Senaryoları (Aylık)","Example User Stories (Monthly)")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stories.map((s) => {
                const ic =
                  s.icon === "receipt" ? ICON.receipt :
                  s.icon === "factory" ? ICON.factory :
                  s.icon === "message" ? ICON.message :
                  ICON.wrench;
                return (
                  <Card key={s.id} className="rounded-2xl p-5 border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">{ic}</div>
                      <div className="font-semibold text-slate-900">{s.name[lang]}</div>
                    </div>
                    <div className="text-xs text-slate-500 mb-3">{s.assumptions[lang]}</div>
                    <div className="text-slate-700 text-sm">
                      <span className="font-semibold">{T(lang,"Tahmin:","Estimate:")}</span>{" "}
                      {money(s.estimate.min)}–{money(s.estimate.max)}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* PILOT: USB CERTIFICATION VIEW */}
          <div
            className={`transition-all duration-500 ${
              view === "pilot" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none h-0 overflow-hidden"
            }`}
          >
            <Card className="rounded-2xl p-6 border border-slate-200 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={USB_LOGO_URL} alt="USB Certification" className="h-8 w-auto object-contain" />
                  <div>
                    <div className="text-xl font-bold text-slate-900">USB Certification</div>
                    <div className="text-xs text-slate-600">
                      {T(lang, "Pilot Çalışma Özeti", "Pilot Engagement Overview")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone="emerald">{T(lang,"Pilot","Pilot")}</Pill>
                  <Button variant="outline" onClick={()=>setView("pricing")} className="inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {T(lang,"Genel Fiyata Dön","Back to Pricing")}
                  </Button>
                </div>
              </div>

              {/* Switch & inputs */}
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT PANE */}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-700 mb-1">{T(lang,"Dağıtım Seçeneği","Deployment Option")}</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id:"aws", label:"AWS (Managed)"},
                        { id:"local", label:T(lang,"Yerel (On-prem)","Local (On-prem)")},
                      ].map(d=>(
                        <Button key={d.id} variant={pilot.deployment===d.id ? "default":"outline"}
                          className={pilot.deployment===d.id ? "bg-indigo-600 hover:bg-indigo-500" : "bg-white"}
                          onClick={()=>setPilot(s=>({ ...s, deployment: d.id as "aws"|"local" }))}>
                          {d.id==="aws" ? ICON.cloud : ICON.server}
                          <span className="ml-1">{d.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-slate-600 mb-1">{T(lang,"Kullanıcı (chat)","Users (chat)")}</div>
                      <input type="number" value={pilot.users}
                        onChange={(e)=>setPilot(s=>({ ...s, users: Math.max(0, +e.target.value||0) }))}
                        className="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-indigo-400"/>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {T(lang,"$100/kullanıcı/ay kredi","$100/user/mo credit")}
                      </div>
                    </div>
                    {pilot.deployment==="local" && (
                      <div>
                        <div className="text-xs text-slate-600 mb-1">{T(lang,"Aylık İşletme (Yerel)","Monthly Ops (Local)")}</div>
                        <input type="number" value={pilot.localMonthlyOps}
                          onChange={(e)=>setPilot(s=>({ ...s, localMonthlyOps: Math.max(0, +e.target.value||0) }))}
                          className="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-indigo-400"/>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {T(lang,"Çalışma/enerji/SRE tahmini","Ops/energy/SRE estimate")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Note: Tier fixed to Enterprise (numbers unchanged) */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
                    {T(lang, "Paket: Enterprise (sabit). Rakamlar brief ile uyumludur.", "Package: Enterprise (fixed). Figures follow the brief.")}
                  </div>

                  {/* NEW: Optional Fine-Tuning toggle + quick selection */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-800 inline-flex items-center gap-2">
                        {ICON.wand}
                        {T(lang, "İnce Ayar (Tek Seferlik)", "Fine-Tuning (One-time)")}
                      </div>
                      <Button
                        variant={pilot.includeFT ? "default" : "outline"}
                        className={pilot.includeFT ? "bg-violet-600 hover:bg-violet-500" : "bg-white"}
                        onClick={() => setPilot(s => ({ ...s, includeFT: !s.includeFT }))}
                      >
                        {pilot.includeFT ? T(lang, "Dahil", "Included") : T(lang, "Ekle", "Add")}
                      </Button>
                    </div>
                    {pilot.includeFT && (
                      <div className="mt-3">
                        <div className="text-[12px] text-slate-600 mb-1">{T(lang,"Tür","Type")}</div>
                        <div className="flex flex-wrap gap-2">
                          {DEFAULT_FINE_TUNE.map(ft => (
                            <Button
                              key={ft.id}
                              size="sm"
                              variant={pilot.ftId===ft.id ? "default" : "outline"}
                              className={pilot.ftId===ft.id ? "bg-slate-900 hover:bg-slate-800" : "bg-white"}
                              onClick={() => setPilot(s => ({ ...s, ftId: ft.id as "hosted-ft"|"private-model" }))}
                            >
                              {ft.name[lang]}
                            </Button>
                          ))}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-2">
                          {T(lang, "Kurulum ücreti tek seferlik toplam bedele eklenir.", "Setup fee is added once to the upfront total.")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Document Information Summaries */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="text-xs font-semibold text-slate-700 mb-2">
                      {T(lang,"Doküman Bilgi Özetleri","Document Info Summaries")}
                    </div>
                    <div className="space-y-3">
                      {usbSummaries.map(({ id, title, totals }) => (
                        <div key={id} className="rounded-md border bg-slate-50 p-2">
                          <div className="text-[13px] font-medium text-slate-800 mb-1">{title}</div>
                          <div className="text-[12px] space-y-1">
                            {totals.rowsTotal>0 && (
                              <div> {T(lang,"Toplam Satır","Total Rows")}: {fmt(lang, totals.rowsTotal)} • {T(lang,"Aylık","Monthly")}: {fmt(lang, totals.rowsMonthly)}</div>
                            )}
                            {totals.pagesTotal>0 && (
                              <div> {T(lang,"Toplam Sayfa","Total Pages")}: {fmt(lang, totals.pagesTotal)} • {T(lang,"Aylık","Monthly")}: {fmt(lang, totals.pagesMonthly)}</div>
                            )}
                            {totals.gbTotal>0 && (
                              <div> {T(lang,"Toplam Boyut","Total Size")}: {fmt(lang, totals.gbTotal)} GB • {T(lang,"Aylık","Monthly")}: {fmt(lang, totals.gbMonthly)} GB</div>
                            )}
                            {totals.usersTotal>0 && (
                              <div> {T(lang,"Kullanıcı","Users")}: {fmt(lang, totals.usersTotal)} • {T(lang,"Aylık Aktif","Monthly Active")}: {fmt(lang, totals.usersMonthly)}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live breakdown */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Xong monthly bracket */}
                    <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                      <div className="text-xs text-slate-500">{T(lang,"Xong (Abonelik+Kullanım)","Xong (Subscription+Usage)")}</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {money(pilotComputed.xongMonthlyBracket.min)}–{money(pilotComputed.xongMonthlyBracket.max)} / {T(lang,"ay","mo")}
                      </div>
                      <div className="text-xs text-slate-500">{T(lang,"Müşteri aralığı","Client bracket")} • Enterprise</div>
                    </div>

                    {/* Deployment monthly */}
                    {pilot.deployment==="aws" ? (
                      <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                        <div className="text-xs text-slate-500">AWS</div>
                        <div className="text-xl font-semibold text-slate-900">
                          {money(pilotComputed.awsMonthly.min)}–{money(pilotComputed.awsMonthly.max)} / {T(lang,"ay","mo")}
                        </div>
                        <div className="text-xs text-slate-500">{T(lang,"Müşteri aralığı","Client bracket")}</div>
                      </div>
                    ) : (
                      <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                        <div className="text-xs text-slate-500">{T(lang,"Yerel Operasyon","Local Ops")}</div>
                        <div className="text-xl font-semibold text-slate-900">
                          {money(pilotComputed.localMonthlyOps)} / {T(lang,"ay","mo")}
                        </div>
                        <div className="text-xs text-slate-500">{T(lang,"Çalıştırma maliyetleri","Working expenses")}</div>
                      </div>
                    )}

                    {/* Training upfront */}
                    {/* <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                      <div className="text-xs text-slate-500">{T(lang,"Eğitim (Upfront)","Training (Upfront)")}</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {money(pilotComputed.trainingUpfront.min)}–{money(pilotComputed.trainingUpfront.max)}
                      </div>
                      <div className="text-xs text-slate-500">{T(lang,"Müşteri aralığı","Client bracket")}</div>
                    </div> */}

                    {/* Optional Fine-Tuning (one-time) */}
                    {pilot.includeFT && (
                      <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                        <div className="text-xs text-slate-500">
                          {T(lang,"İnce Ayar (Tek Seferlik)","Fine-Tuning (One-time)")}
                        </div>
                        <div className="text-xl font-semibold text-slate-900">
                          {money(pilotComputed.ftUpfront.min)}–{money(pilotComputed.ftUpfront.max)}
                        </div>
                        <div className="text-xs text-slate-500">{pilotComputed.ftLabel}</div>
                      </div>
                    )}

                    {/* Local upfront if local */}
                    {pilot.deployment==="local" && (
                      <div className="rounded-xl ring-1 ring-slate-200 p-4 bg-white">
                        <div className="text-xs text-slate-500">{T(lang,"Yerel Dağıtım (Upfront)","Local Deployment (Upfront)")}</div>
                        <div className="text-xl font-semibold text-slate-900">
                          {money(pilotComputed.localUpfront.min)}–{money(pilotComputed.localUpfront.max)}
                        </div>
                        <div className="text-xs text-slate-500">{T(lang,"Donanım & kurulum","Hardware & enablement")}</div>
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white p-5 grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm/5 opacity-90">{T(lang,"Toplam Aylık (Tahmini)","Total Monthly (Est.)")}</div>
                      <div className="text-2xl font-extrabold">
                        {money(pilotComputed.monthly.min)}–{money(pilotComputed.monthly.max)}
                      </div>
                      <div className="text-xs opacity-90">
                        {pilot.deployment==="aws"
                          ? T(lang,"Xong + AWS + chat kredisi","Xong + AWS + chat credit")
                          : T(lang,"Xong + Yerel Ops + chat kredisi","Xong + Local Ops + chat credit")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm/5 opacity-90">{T(lang,"Toplam Upfront","Total Upfront")}</div>
                      <div className="text-2xl font-extrabold">
                        {money(pilotComputed.upfront.min)}–{money(pilotComputed.upfront.max)}
                      </div>
                      <div className="text-xs opacity-90">
                        {pilot.deployment==="aws"
                          ? (pilot.includeFT
                              ? T(lang,"Eğitim + İnce Ayar","Training + Fine-Tuning")
                              : T(lang,"Eğitim","Training"))
                          : (pilot.includeFT
                              ? T(lang,"Eğitim + Yerel dağıtım + İnce Ayar","Training + Local deployment + Fine-Tuning")
                              : T(lang,"Eğitim + Yerel dağıtım","Training + Local deployment"))}
                      </div>
                    </div>
                  </div>

                  {/* Resource Calculations (from Excel) — EXPANDABLE */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3">
                      {T(lang,"Kaynak Hesapları (Excel’den)","Resource Calculations (from Excel)")}
                    </h4>

                    {USB_GROUPS.map(group => {
                      const totals = computeTotals(group.items);
                      const isOpen = expanded[group.id];

                      return (
                        <Card key={group.id} className="rounded-2xl p-0 border border-slate-200 bg-white mb-5 overflow-hidden">
                          {/* Header with expand/collapse */}
                          <div className="flex items-center justify-between px-5 py-4">
                            <div className="font-semibold text-slate-900">{group.title}</div>
                            <div className="flex items-center gap-2">
                              {/* summary chips */}
                              <div className="hidden md:flex flex-wrap gap-2 text-[11px] mr-2">
                                {totals.rowsTotal>0 && (
                                  <span className="px-2 py-0.5 rounded bg-slate-50 border">
                                    {T(lang,"Toplam Satır","Total Rows")}: {fmt(lang, totals.rowsTotal)} • {T(lang,"Aylık","Monthly")}: {fmt(lang, totals.rowsMonthly)}
                                  </span>
                                )}
                                {totals.pagesTotal>0 && (
                                  <span className="px-2 py-0.5 rounded bg-slate-50 border">
                                    {T(lang,"Toplam Sayfa","Total Pages")}: {fmt(lang, totals.pagesTotal)} • {T(lang,"Aylık","Monthly")}: {fmt(lang, totals.pagesMonthly)}
                                  </span>
                                )}
                                {totals.gbTotal>0 && (
                                  <span className="px-2 py-0.5 rounded bg-slate-50 border">
                                    {T(lang,"Toplam Boyut","Total Size")}: {fmt(lang, totals.gbTotal)} GB • {T(lang,"Aylık","Monthly")}: {fmt(lang, totals.gbMonthly)} GB
                                  </span>
                                )}
                                {totals.usersTotal>0 && (
                                  <span className="px-2 py-0.5 rounded bg-slate-50 border">
                                    {T(lang,"Kullanıcı","Users")}: {fmt(lang, totals.usersTotal)} • {T(lang,"Aylık Aktif","Monthly Active")}: {fmt(lang, totals.usersMonthly)}
                                  </span>
                                )}
                              </div>

                              <button
                                className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50"
                                onClick={()=>setExpanded(s=>({ ...s, [group.id]: !isOpen }))}
                                aria-expanded={isOpen}
                                aria-label={isOpen ? "Collapse" : "Expand"}
                              >
                                {isOpen ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Body */}
                          {isOpen && (
                            <div className="px-5 pb-5">
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="text-left text-slate-600">
                                      <th className="py-2 pr-3">{T(lang,"Kaynak","Resource")}</th>
                                      <th className="py-2 pr-3">{T(lang,"Açıklama","Description")}</th>
                                      <th className="py-2 pr-3">{T(lang,"Toplam","Total")}</th>
                                      <th className="py-2 pr-3">{T(lang,"Aylık Ort.","Monthly Avg.")}</th>
                                      <th className="py-2">{T(lang,"Birim","Unit")}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="[&_tr:nth-child(even)]:bg-slate-50">
                                    {group.items.map(it => (
                                      <tr key={it.key} className="align-top">
                                        <td className="py-2 pr-3 font-medium text-slate-900">{it.label}</td>
                                        <td className="py-2 pr-3 text-slate-600">{it.desc}</td>
                                        <td className="py-2 pr-3">{it.total != null ? fmt(lang, it.total) : "—"}</td>
                                        <td className="py-2 pr-3">{it.monthly != null ? fmt(lang, it.monthly) : "—"}</td>
                                        <td className="py-2 uppercase text-slate-500">
                                          {it.unit === "rows" ? T(lang,"satır","rows")
                                            : it.unit === "pages" ? T(lang,"sayfa","pages")
                                            : it.unit === "gb" ? "GB"
                                            : it.unit === "users" ? T(lang,"kullanıcı","users")
                                            : T(lang,"adet","count")}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </Card>
                      );
                    })}

                    <div className="text-[11px] text-slate-500">
                      {T(
                        lang,
                        "Hesap yöntemi: $100/kullanıcı/ay sohbet kredisi + AWS dağıtım hesaplayıcısı + Token/Tuning + Abonelik. Tablolar modül bazında toplam ve aylık ortalama özetler.",
                        "Method: $100/user/mo chat credit + AWS deployment calculator + Token/Tuning + Subscription. Tables summarize totals and monthly averages per module."
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
