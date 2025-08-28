import { HowItWorks } from "@/components/sections/how-it-works";

// Base presentation data structure
const basePresentationData = {
  hero: {
    title: {
      en: "Xong — Autonomous Multi-Agent System",
      tr: "Xong — Otonom Çok Ajanlı Sistem"
    },
    subtitle: {
      en: "Removes manual workflows for SMBs and enterprises. Connect → Extract → Verify → Route → Generate. Human-grade outcomes, audit-grade control.",
      tr: "KOBİ ve kurumsal işletmeler için manuel iş akışlarını ortadan kaldırır. Bağla → Çıkar → Doğrula → Yönlendir → Oluştur. İnsan kalitesinde sonuçlar, denetim kalitesinde kontrol."
    },
    metrics: [
      {
        value: "%60+",
        label: { en: "Less Manual Interaction", tr: "Daha Az Manuel Müdahale" }
      },
      {
        value: "%70+",
        label: { en: "Cycle Time", tr: "İş Süreci Kısalması" }
      },
      {
        value: "98.5%",
        label: { en: "Audit Trail", tr: "Denetim İzi" }
      }
    ]
  },
  executiveSummary: {
    title: { en: "Executive Summary", tr: "Yönetici Özeti" },
    cards: [
      {
        title: { en: "Seed Funding Ask", tr: "Tohum Fon Talebi" },
        value: "$750K",
        subtitle: { en: "12 month runway", tr: "12 aylık işletme" },
        color: "primary"
      },
      {
        title: { en: "Target ARR (Y2)", tr: "Hedef ARR (2. Yıl)" },
        value: "~$2.23M",
        subtitle: { en: "Convert pilots to revenue", tr: "Pilotları gelire dönüştür" },
        color: "success"
      },
      {
        title: { en: "IPA Market (2030)", tr: "IPA Pazarı (2030)" },
        value: "$44.7B",
        subtitle: { en: "CAGR 20.6%", tr: "CAGR %20.6" },
        color: "accent"
      },
      {
        title: { en: "Deployment Options", tr: "Dağıtım Seçenekleri" },
        value: "3 Ways",
        subtitle: { en: "SaaS / On-Prem / Local", tr: "SaaS / Yerinde / Yerel" },
        color: "purple"
      }
    ]
  },
  problemSolution: {
    problem: {
      title: { en: "The Problem — Unmapped Workflows → Manual Work", tr: "Sorun — Haritalanmamış Akış → Manuel İş" },
      subtitle: { en: "Operations, Finance, Compliance, IT, HR teams struggle with:", tr: "Operasyon, Finans, Uyum, BT, İK ekipleri bunlarla mücadele ediyor:" },
      points: [
        { en: "• Workflows not properly mapped and documented", tr: "• Akış haritalanmamış ve belgelenmemiş" },
        { en: "• Rigid applications requiring manual workarounds", tr: "• Katı uygulamalar manuel geçici çözümler gerektiriyor" },
        { en: "• Manual validation and error-prone handoffs", tr: "• Manuel doğrulama ve hataya açık devir işlemleri" },
        { en: "• Process-focused applications with limited automation", tr: "• Süreç odaklı uygulamalar kısıtlı otomasyon" },
        { en: "• Business data underutilized, causing poor transformation", tr: "• İş verileri yetersiz kullanılıyor, zayıf dönüşüm" }
      ]
    },
    solution: {
      title: { en: "Solution — Human × Context × Flow", tr: "Çözüm — İnsan × Bağlam × Akış" },
      subtitle: { en: "Guided setup with Pipeline Manager. Drag-drop studio. Deploy: SaaS/On-prem/Local", tr: "Pipeline Manager ile kılavuzlu kurulum. Sürükle-bırak stüdyo. Dağıtım: SaaS/Yerinde/Yerel" },
      pipeline: [
        { label: { en: "Connect", tr: "Bağlan" }, icon: "database", description: { en: "Map processes, Connect sources", tr: "Süreçleri haritala, Kaynakları bağla" } },
        { label: { en: "Extract", tr: "Çıkar" }, icon: "search", description: { en: "Documents, Images/Videos", tr: "Belgeler, Görüntüler/Video" } },
        { label: { en: "Verify", tr: "Doğrula" }, icon: "shield-check", description: { en: "Cross-validation and approval", tr: "Çapraz doğrulama ve onay" } },
        { label: { en: "Route", tr: "Yönlendir" }, icon: "arrow-right", description: { en: "Orchestration", tr: "Orkestrasyon" } },
        { label: { en: "Generate", tr: "Üret" }, icon: "file-text", description: { en: "Reports, Actions", tr: "Raporlar, Eylemler" } }
      ]
    }
  },

howItWorks :{
  title: { en: "How It Works — Data → Decisions", tr: "Nasıl Çalışır — Veri → Kararlar" },
  subtitle: {
    en: "Platform turns raw business data into actionable decisions",
    tr: "Platform ham iş verilerini eyleme dönüştürülebilir kararlara çevirir"
  },
  architecture: [
    {
      layer: { en: "Sources", tr: "Kaynaklar" },
      components: [
        { id: "src-erp",  name: "ERP", icon: "database",
          description: { en: "Orders, WOs, AP/AR, inventory", tr: "Sipariş, iş emri, AP/AR, stok" } },
        { id: "src-crm",  name: "CRM", icon: "users",
          description: { en: "Accounts, contacts, cases", tr: "Müşteri, kişi, vaka" } },
        { id: "src-docs", name: { en: "Documents", tr: "Dokümanlar" }, icon: "file-text",
          description: { en: "PDF, Word, scans, forms", tr: "PDF, Word, taramalar, formlar" } },
        { id: "src-img",  name: { en: "Images", tr: "Görseller" }, icon: "image",
          description: { en: "Field/factory photos, screenshots", tr: "Saha/fabrika fotoğrafları, ekran görüntüleri" } },
        { id: "src-vid",  name: { en: "Videos", tr: "Videolar" }, icon: "video",
          description: { en: "Drones, line cams, inspections", tr: "Drone, hat kameraları, denetimler" } },
        { id: "src-audio", name: { en: "Voice Records", tr: "Ses Kayıtları" }, icon: "mic",
          description: { en: "Calls, memos, interviews", tr: "Çağrılar, notlar, görüşmeler" } },
        { id: "src-sensor", name: { en: "Sensor Data", tr: "Sensör Verileri" }, icon: "activity",
          description: { en: "SCADA/IoT time-series", tr: "SCADA/IoT zaman serisi" } },
        { id: "src-mail",  name: { en: "Mail Data", tr: "E-posta Verileri" }, icon: "mail",
          description: { en: "MIME, headers, attachments", tr: "MIME, başlıklar, ekler" } },
        { id: "src-db",   name: { en: "Databases", tr: "Veritabanları" }, icon: "server",
          description: { en: "Postgres, MSSQL, Oracle; CDC", tr: "Postgres, MSSQL, Oracle; CDC" } },
        { id: "src-api",  name: "APIs", icon: "settings",
          description: { en: "External/internal REST/GraphQL", tr: "Harici/dahili REST/GraphQL" } }
      ]
    },
    {
      layer: { en: "Ingestion & Parsing", tr: "İçe Alma & Ayrıştırma" },
      components: [
        { id: "ing-ocr", name: "OCR", icon: "scan-text",
          description: { en: "Text extraction from scans/images", tr: "Taramalardan/görsellerden metin çıkarımı" } },
        { id: "ing-layout", name: { en: "Layout Analysis", tr: "Yerleşim Analizi" }, icon: "layout",
          description: { en: "Pages, tables, headers, spans", tr: "Sayfalar, tablolar, başlıklar, metin alanları" } },

        { id: "ing-video-keyframes", name: { en: "Video Keyframes", tr: "Video Ana Kareler" }, icon: "frame",
          description: { en: "Shot/scene split, keyframe sampling", tr: "Plan/sahne ayrımı, ana kare örnekleme" } },
        { id: "ing-vision-detect", name: { en: "Vision Detection", tr: "Görsel Tespit" }, icon: "scan",
          description: { en: "Objects/defects, classification", tr: "Nesne/defekt tespiti, sınıflandırma" } },
        { id: "ing-vision-caption", name: { en: "Captioning & Tags", tr: "Açıklama & Etiket" }, icon: "tags",
          description: { en: "Image/video captions, tags", tr: "Görsel/video açıklamaları, etiketler" } },

        { id: "ing-asr", name: { en: "Speech-to-Text (ASR)", tr: "Konuşmadan Metne (ASR)" }, icon: "mic",
          description: { en: "Multilingual ASR, timestamps", tr: "Çok dilli ASR, zaman damgası" } },
        { id: "ing-diar", name: { en: "Diarization", tr: "Konuşmacı Ayrımı" }, icon: "users",
          description: { en: "Speaker segmentation", tr: "Konuşmacı segmentasyonu" } },

        { id: "ing-sensor-parse", name: { en: "Sensor Parser", tr: "Sensör Ayrıştırıcı" }, icon: "activity",
          description: { en: "Resample, align windows", tr: "Yeniden örnekleme, zaman penceresi hizalama" } },
        { id: "ing-mail-parse", name: { en: "E-mail Parser", tr: "E-posta Ayrıştırıcı" }, icon: "mail",
          description: { en: "Threading, attachment extraction", tr: "Zincirleme, ek çıkarımı" } },
        { id: "ing-db-cdc", name: { en: "DB/CDC Extract", tr: "VT/CDC Çıkarma" }, icon: "database",
          description: { en: "Change capture, schema map", tr: "Değişim yakalama, şema haritalama" } },

        { id: "ing-embed", name: { en: "Embeddings", tr: "Gömme" }, icon: "hexagon",
          description: { en: "Text & vision vector reps", tr: "Metin & görsel vektör temsilleri" } },
        { id: "ing-metadata", name: { en: "Metadata", tr: "Üst Veri" }, icon: "info",
          description: { en: "EXIF/GPS, checksum, provenance", tr: "EXIF/GPS, sağlama, köken" } }
      ]
    },
    {
      layer: { en: "Knowledge & Control", tr: "Bilgi & Kontrol" },
      components: [
        { id: "kn-store-bucket", name: { en: "Buckets (S3/MinIO)", tr: "Kovalar (S3/MinIO)" }, icon: "archive",
          description: { en: "Immutable originals", tr: "Değiştirilemeyen orijinaller" } },
        { id: "kn-vector", name: { en: "Vector Store", tr: "Vektör Deposu" }, icon: "boxes",
          description: { en: "Hybrid retrieval (text+vision)", tr: "Hibrit arama (metin+görsel)" } },
        { id: "kn-graph",  name: { en: "Knowledge Graph", tr: "Bilgi Grafı" }, icon: "git-branch",
          description: { en: "Entities & relationships", tr: "Varlıklar ve ilişkiler" } },
        { id: "kn-kv", name: { en: "K/V Fields", tr: "A/K Alanları" }, icon: "list",
          description: { en: "Structured values from docs", tr: "Dokümanlardan yapılandırılmış değerler" } },
        { id: "kn-policy", name: { en: "Policies & Guardrails", tr: "Politikalar & Korkuluklar" }, icon: "gavel",
          description: { en: "PII, residency, retention", tr: "Kişisel veri, yerleşim, saklama" } },
        { id: "kn-lineage", name: { en: "Lineage & Audit", tr: "Soy Geçmişi & Denetim" }, icon: "history",
          description: { en: "Every step traced", tr: "Her adım izlenir" } }
      ]
    },
    {
      layer: { en: "Agents & Orchestration", tr: "Ajanlar & Orkestrasyon" },
      components: [
        { id: "ag-orchestrator", name: { en: "Pipeline Manager", tr: "Boru Hattı Yöneticisi" }, icon: "settings",
          description: { en: "Guided setup, drag-drop flows", tr: "Kılavuzlu kurulum, sürükle-bırak akışlar" } },
        { id: "ag-doc-extract", name: { en: "Document Extraction", tr: "Belge Çıkarma" }, icon: "file-search",
          description: { en: "Forms, invoices, CVs", tr: "Form, fatura, özgeçmiş" } },
        { id: "ag-vision", name: { en: "Vision Processing", tr: "Görüş İşleme" }, icon: "scan",
          description: { en: "Defect tagging, compliance", tr: "Defekt etiketleme, uygunluk" } },
        { id: "ag-asr-analytics", name: { en: "Speech Analytics", tr: "Konuşma Analitiği" }, icon: "mic",
          description: { en: "Topics, sentiment, QA", tr: "Konular, duygu, kalite" } },
        { id: "ag-verify", name: { en: "Verification", tr: "Doğrulama" }, icon: "check-square",
          description: { en: "3-way match, coverage, spec limits", tr: "3 yönlü eşleştirme, kapsama, spesifikasyon limitleri" } },
        { id: "ag-risk", name: { en: "Risk Scoring", tr: "Risk Skorlama" }, icon: "shield-check",
          description: { en: "Asset/transaction risk", tr: "Varlık/işlem riski" } },
        { id: "ag-route", name: { en: "Routing & HITL", tr: "Yönlendirme & İnsan Onayı" }, icon: "route",
          description: { en: "Exceptions, approvals", tr: "İstisnalar, onaylar" } },
        { id: "ag-generate", name: { en: "Report/Pack Generator", tr: "Rapor/Paket Üretici" }, icon: "file-check",
          description: { en: "PDF/JSON, eCTD-ready", tr: "PDF/JSON, eCTD-uyumlu" } }
      ]
    }
  ]
},




  marketOpportunity: {
    title: { en: "Market Opportunity — Segmented (Do Not Sum)", tr: "Market Boyutları — Toplam (2024 - Billion Dollars)" },
    subtitle: { en: "Multiple overlapping market segments with strong growth", tr: "Güçlü büyüme ile çoklu örtüşen pazar segmentleri" },
    segments: [
      {
        name: { en: "Artificial Intelligence", tr: "Yapay Zeka" },
        base: 279.22,
        future: 1811.75,
        cagr: 35.9,
        year: "2024",
        baseYear: "2024",
        futureYear: "2030"
      },
      {
        name: { en: "Intelligent Document Processing", tr: "Akıllı Belge İşleme" },
        base: 2.3,
        future: 12.35,
        cagr: 33.1,
        year: "2024",
        baseYear: "2024",
        futureYear: "2030"
      },
      {
        name: { en: "Intelligent Process Automation", tr: "Akıllı Süreç Otomasyonları" },
         base: 14.55,
        future: 44.74,
        cagr: 20.6,
        year: "2024",
        baseYear: "2024",
        futureYear: "2030"
      },
      {
        name: { en: "Computer Vision", tr: "Bilgisayarda Görü" },
        base: 19.82,
        future: 58.29,
        cagr: 19.8,
        year: "2024",
        baseYear: "2024",
        futureYear: "2030"
      },
      {
        name: { en: "MLOps", tr: "ML Ops" },
        base: 2.19,
        future: 16.61,
        cagr: 40.5,
        year: "2024",
        baseYear: "2024",
        futureYear: "2030"
      },
      {
        name: { en: "AI Automation Platforms", tr: "AI Otomasyon Platformları" },
        base: 12.91,
        future: 39.04,
        cagr: -20.2,
        year: "2024",
        baseYear: "2024",
        futureYear: "2030"
      },
      {
        name: { en: "Knowledge Graphs", tr: "Bilgi Grafiği" },
        base: 1.07,
        future: 7.34,
        cagr: 23.7,
        year: "2024",
        baseYear: "2024",
        futureYear: "2030"
      }
    ]
  },
  personas: [
    {
      id: "A1",
      title: { en: "Independent Field Inspector", tr: "Bağımsız Saha Denetçisi" },
      context: { en: "Images + PDFs → verified report", tr: "Görüntüler + PDF → doğrulanmış rapor" },
      description: { 
        en: "Solo contractor doing factory/site inspections with same-day reporting", 
        tr: "Fabrika/saha denetimleri yapan solo müteahhit, aynı gün raporlama" 
      },
      workflow: {
        en: "Sources: Images/Video → Ingest & Parse (OCR, captions, embeddings) → Understand (Vision tag, K/V extraction) → Verify (Checklist coverage, EXIF match) → Pipeline Manager → Outputs (Same-day reports, ≥60% missed items)",
        tr: "Kaynaklar: Görüntüler/Video → İçe alma & Ayrıştırma (OCR, başlıklar, gömme) → Anlama (Görü etiketi, K/V çıkarma) → Doğrulama (Kontrol listesi kapsamı, EXIF eşleşmesi) → Pipeline Manager → Çıktılar (Aynı gün raporlar, ≥%60 kaçırılan öğeler)"
      },
      metrics: [
        { label: { en: "Same-day reports", tr: "Aynı gün raporlar" }, value: "✓" },
        { label: { en: "First-pass acceptance", tr: "İlk geçiş kabulü" }, value: "≥90%" },
        { label: { en: "Missed items reduction", tr: "Kaçırılan öğe azalması" }, value: "≥60%" }
      ],
      tier: { en: "SaaS Basic • Usage: media minutes + docs • Retention 180 days", tr: "SaaS Temel • Kullanım: medya dakikaları + belgeler • Saklama 180 gün" },
      color: "blue"
    },
    {
      id: "B1",
      title: { en: "HR Consultancy — CVs to Shortlist + Compliance Pack", tr: "İK Danışmanlığı — CV'lerden Kısa Listeye + Uyum Paketi" },
      context: { en: "CVs → Shortlist + Compliance Package", tr: "CV'ler → Kısa Liste + Uygunluk Paketi" },
      description: { 
        en: "Small HR consultancy screening CVs with compliance documentation", 
        tr: "CV'leri uygunluk belgelendirmesi ile tarayan küçük İK danışmanlığı" 
      },
      workflow: {
        en: "CVs → Job Spec → Parse → Rank → Pack → Client. Timeline: 6h → 1h. Audit ≥95%. SaaS • Pro. PII masked • DLP IDs",
        tr: "CV'ler → İş Tanımı → Ayrıştırma → Sıralama → Paket → Müşteri. Zaman: 6s → 1s. Denetim ≥%95. SaaS • Pro. PII gizli • DLP ID'leri"
      },
      metrics: [
        { label: { en: "Time reduction", tr: "Süre azalması" }, value: "6h → 1h" },
        { label: { en: "Pack completeness", tr: "Paket bütünlüğü" }, value: "≥95%" },
        { label: { en: "Audit quality", tr: "Denetim kalitesi" }, value: "≥95%" }
      ],
      tier: { en: "SaaS • Pro", tr: "SaaS • Pro" },
      color: "green"
    },
    {
      id: "B2",
      title: { en: "Precision Machine Shop (Work Orders → Traceable QA)", tr: "Hassas İmalat Atölyesi (İş Emirleri → İzlenebilir QA)" },
      context: { en: "Work Orders → Traceable QA", tr: "İş Emirleri → İzlenebilir QA" },
      description: { 
        en: "Custom metal parts manufacturing requiring step-by-step photo documentation", 
        tr: "Adım adım fotoğraf belgelendirmesi gerektiren özel metal parça imalatı" 
      },
      workflow: {
        en: "Sources: ERP WO, Step checklists → Ingest & Parse (OCR/metadata, Buckets) → Understand (Vision tags) → Verify → QA dossier generator → Outputs. Step coverage timestamp w/thin operation window",
        tr: "Kaynaklar: ERP WO, Adım kontrol listeleri → İçe Alma & Ayrıştırma (OCR/metadata, Kovalar) → Anlama (Görü etiketleri) → Doğrulama → QA dosya oluşturucu → Çıktılar. Adım kapsamı zaman damgası w/ince operasyon penceresi"
      },
      metrics: [
        { label: { en: "Late dossiers", tr: "Geç dosyalar" }, value: "-80%" },
        { label: { en: "Chargebacks", tr: "Geri ödemeler" }, value: "-50%" },
        { label: { en: "First-pass yield", tr: "İlk geçiş verimi" }, value: "+5-10%" }
      ],
      tier: { en: "Governance: On-prem bucket mirror optional; 3-year retention. Deploy & tier fit: On-prem (shop floor), Pro", tr: "Yönetim: On-prem kova yansıma opsiyonel; 3 yıl saklama. Dağıtım ve katman uyumu: On-prem (atölye katı), Pro" },
      color: "indigo"
    },
    {
      id: "C1",
      title: { en: "Pharmaceutical QA (BMRs → compliance Pack)", tr: "İlaç QA (BMR'ler → uyum Paketi)" },
      context: { en: "BMR + Lab Images → eCTD Compliance Pack", tr: "BMR + Lab Görselleri → eCTD Uyum Paketi" },
      description: { 
        en: "GxP manufacturer assembling Batch Manufacturing Records with lab data", 
        tr: "Lab verileri ile Toplu İmalat Kayıtları derleyen GxP üreticisi" 
      },
      workflow: {
        en: "Sources: LIMS, MES → Ingest & Parse (OCR, parsers, buckets) → Understand (K/V + entities, lot, operator, embeddings) → Orchestrate (Route deviations → CAPA draft → Pack generator) → Deviation log, CAPA draft, Compliance Pack",
        tr: "Kaynaklar: LIMS, MES → İçe Alma & Ayrıştırma (OCR, ayrıştırıcılar, kovalar) → Anlama (K/V + varlıklar, lot, operatör, gömme) → Orkestrasyon (Sapmaları yönlendir → CAPA taslağı → Paket oluşturucu) → Sapma günlüğü, CAPA taslağı, Uyum Paketi"
      },
      metrics: [
        { label: { en: "Review time per batch", tr: "Parti başı inceleme süresi" }, value: "-60-70%" },
        { label: { en: "Deviation detection", tr: "Sapma tespiti" }, value: "+30%" },
        { label: { en: "Audit observations", tr: "Denetim bulguları" }, value: "-50%" }
      ],
      tier: { en: "Governance: On-prem/private cloud • RBAC. Deploy & tier: On-prem - Enterprise", tr: "Yönetim: On-prem/özel bulut • RBAC. Dağıtım ve katman: On-prem - Kurumsal" },
      color: "purple"
    },
    {
      id: "D1",
      title: { en: "Energy Utility (Asset Inspections → Risk Scoring)", tr: "Enerji Kuruluşu (Varlık Denetimleri → Risk Skorlama)" },
      context: { en: "Asset Inspections → Risk Scoring", tr: "Varlık Denetimleri → Risk Skorlama" },
      description: { 
        en: "Utility managing transmission assets with drone/SCADA data integration", 
        tr: "İletim varlıklarını drone/SCADA veri entegrasyonu ile yöneten kuruluş" 
      },
      workflow: {
        en: "Sources: Drone, SIMC/DMS, OGISS → Ingest (Stream captions, keyframes) → Understand (Vision defects, embeddings, asset graph link) → Verify (GPS/asset match, alarm correlation window) → Orchestrate (Risk dashboard create WO, list, evidence clips)",
        tr: "Kaynaklar: Drone, SIMC/DMS, OGISS → İçe Alma (Akış başlıkları, anahtar kareler) → Anlama (Görü kusurları, gömme, varlık grafik bağlantısı) → Doğrulama (GPS/varlık eşleşmesi, alarm korelasyon penceresi) → Orkestrasyon (Risk panosu WO oluştur, liste, kanıt klipleri)"
      },
      metrics: [
        { label: { en: "Triage time", tr: "Önceliklendirme süresi" }, value: "days → hours" },
        { label: { en: "Outages", tr: "Kesintiler" }, value: "-10-20%" },
        { label: { en: "Truck rolls", tr: "Saha çıkışı" }, value: "-15%" }
      ],
      tier: { en: "Governance: On-prem isolated, audit. Deploy: On-prem, Enterprise", tr: "Yönetim: On-prem izole, denetim. Dağıtım: On-prem, Kurumsal" },
      color: "amber"
    },
    {
      id: "D2",
      title: { en: "Global Manufacturer (AP/Procurement → Touchless Matching)", tr: "Küresel Üretici (AP/Satın Alma → Temassız Eşleştirme)" },
      context: { en: "AP/Procurement → Touchless Matching", tr: "Satın Alma → Temassız Eşleştirme" },
      description: { 
        en: "Multi-ERP landscape with automated invoice processing and vendor management", 
        tr: "Otomatik fatura işleme ve tedarikçi yönetimi ile çoklu ERP ortamı" 
      },
      workflow: {
        en: "Ingest invoices/POs/GRNs/vendor master → Extract + fuzzy matching → 3-way match, exceptions only → Auto-post to ERP + compliance report",
        tr: "Faturaları/PO'ları/GRN'leri/tedarikçi ana verisini al → Çıkar + bulanık eşleştirme → 3'lü eşleştirme, sadece istisnalar → ERP'ye otomatik naklet + uyum raporu"
      },
      metrics: [
        { label: { en: "Straight-through processing", tr: "Doğrudan işleme" }, value: "+40-60%" },
        { label: { en: "Duplicates & overpays", tr: "Tekrarlar ve fazla ödemeler" }, value: "-70%" },
        { label: { en: "Cycle time", tr: "Çevrim süresi" }, value: "-50%" }
      ],
      tier: { en: "Enterprise deployment with multi-ERP integration", tr: "Çoklu ERP entegrasyonlu kurumsal dağıtım" },
      color: "red"
    }
  ],
  whatWeOffer: {
    title: { en: "What We Offer — Deploy · Build · Optimize", tr: "Ne Sunuyoruz — Dağıt · Kur · Optimize Et" },
    deploymentOptions: [
      {
        name: { en: "SaaS", tr: "SaaS" },
        description: { en: "AWS/Azure/GCP", tr: "AWS/Azure/GCP" },
        features: [
          { en: "Single-tenant option", tr: "Tek kiracı seçeneği" },
          { en: "Multi-cloud deployment", tr: "Çoklu bulut dağıtımı" }
        ]
      },
      {
        name: { en: "On-Premise", tr: "Yerinde" },
        description: { en: "Dedicated server", tr: "Özel sunucu" },
        features: [
          { en: "Private cloud deployment", tr: "Özel bulut dağıtımı" },
          { en: "Enterprise security", tr: "Kurumsal güvenlik" }
        ]
      },
      {
        name: { en: "Local", tr: "Yerel" },
        description: { en: "Air-gapped appliance", tr: "Ağdan yalıtılmış" },
        features: [
          { en: "Complete isolation", tr: "Tam izolasyon" },
          { en: "Dedicated advisor", tr: "Adanmış danışman" }
        ]
      }
    ],
   platformCore: {
  title: { en: "Platform Core", tr: "Platform Çekirdeği" },
  components: [
    { en: "Business flow Integration", tr: "İş Süreç Entegrasyonu" },
    { en: "Knowledge Extraction",      tr: "Veri-Anlam Çıkarımı" },
    { en: "Connectors",                tr: "Bağlayıcılar" },
    { en: "Ingestion & Parsing",       tr: "İçe Alma & Ayrıştırma" },
    { en: "Vector + Graph",            tr: "Vektör + Grafik" },
    { en: "Orchestrator Studio",       tr: "Orkestratör Stüdyosu" },

    // new, aligned with your architecture
    { en: "Policies & Guardrails",     tr: "Politikalar & Korkuluklar" },
    { en: "Lineage & Audit",           tr: "Soy Geçmişi & Denetim" },
    { en: "Security & Access Control", tr: "Güvenlik & Erişim Kontrolü" },
    { en: "Observability & Telemetry", tr: "Gözlemlenebilirlik & Telemetri" },
    { en: "Model Management & Prompt Library", tr: "Model Yönetimi & İstem Kütüphanesi" },
    { en: "Evaluation & A/B Testing",  tr: "Değerlendirme & A/B Testi" }
  ]
},

    addOns: {
      title: { en: "Add-ons & Services", tr: "Ek Unsurlar & Hizmetler" },
      items: [
        { en: "Fine-tuning", tr: "İnce ayar" },
        { en: "Custom LLMs/Agents", tr: "Özel LLM'ler/Ajanlar" },
        { en: "Rule packs", tr: "Kural paketleri" },
        { en: "Integration services", tr: "Entegrasyon hizmetleri" },
        { en: "SSO + Encryption", tr: "SSO + Şifreleme" },
        { en: "24/7 Support", tr: "7/24 Destek" }
      ]
    }
  },
  pricingTiers: [
    {
      name: { en: "Basic", tr: "Temel" },
      price: "$1.5-3K",
      period: { en: "per month", tr: "aylık" },
      annualValue: "$24+K",
      features: [
        { en: "1-2 starter quota agents", tr: "1-2 başlangıç ajanı kotası" },
        { en: "Connectors", tr: "Bağlayıcılar" },
        { en: "Ingestion, OCR/Parsing", tr: "İçe alma, OCR/Ayrıştırma" },
        { en: "Vector + Graph", tr: "Vektör + Grafik" },
        { en: "Verification & Audit logs", tr: "Doğrulama & Denetim günlükleri" },
        { en: "Add-ons: Packages & Models", tr: "Eklentiler: Paketler ve Modeller" }
      ],
      color: "primary",
      cta: { en: "Get Started", tr: "Başla" }
    },
    {
      name: { en: "Pro", tr: "Pro" },
      price: "$4-8K",
      period: { en: "per month", tr: "aylık" },
      annualValue: "$72K",
      features: [
        { en: "Agents up to 5", tr: "5 ajana kadar" },
        { en: "Orchestrator Studio", tr: "Orkestratör Stüdyosu" },
        { en: "Higher pooled quota", tr: "Daha yüksek havuzlanmış kota" },
        { en: "Support: Success hours", tr: "Destek: Başarı saatleri" },
        { en: "Add-ons: Packages & Models", tr: "Eklentiler: Paketler ve Modeller" }
      ],
      color: "purple",
      popular: true,
      cta: { en: "Get Started", tr: "Başla" }
    },
    {
      name: { en: "Enterprise", tr: "Kurumsal" },
      price: "$10-250K+",
      period: { en: "per month", tr: "aylık" },
      annualValue: "$500K",
      features: [
        { en: "Unlimited/custom agents", tr: "Sınırsız/özel ajanlar" },
        { en: "On-prem option", tr: "Yerinde seçeneği" },
        { en: "Dedicated advisor", tr: "Adanmış danışman" },
        { en: "SLOs, custom models & fine-tuning", tr: "SLO'lar, özel modeller ve ince ayar" },
        { en: "Add-ons: Packages & Models", tr: "Eklentiler: Paketler ve Modeller" }
      ],
      color: "secondary",
      cta: { en: "Contact Sales", tr: "Satışla İletişime Geç" }
    }
  ],
  usageMetrics: {
    title: { en: "Usage Metrics — Flow + Revenue", tr: "Kullanım Ölçümü — Akış + Gelir" },
    subtitle: { en: "Customers billed based on actual usage; subscription covers base platform", tr: "Kullanım dayalı ücretler gerçek tüketimle; abonelik temel platformu kapsar" },
    metrics: [
      {
        name: { en: "Documents", tr: "Belgeler" },
        unit: { en: "per document/page", tr: "belge/sayfa başına" },
        icon: "file-text"
      },
      {
        name: { en: "Image/Video", tr: "Görüntü/Video" },
        unit: { en: "per minute", tr: "dakika başına" },
        icon: "video"
      },
      {
        name: { en: "Pipeline Manager", tr: "Pipeline Manager" },
        unit: { en: "sources", tr: "kaynaklar" },
        icon: "workflow"
      },
      {
        name: { en: "LLM Tokens & Calls", tr: "LLM Tokenları & Çağrılar" },
        unit: { en: "1k token/call", tr: "1k token/çağrı" },
        icon: "cpu"
      },
      {
        name: { en: "Storage & Queries", tr: "Depolama & Arama Sorguları" },
        unit: { en: "GB/month", tr: "GB/ay" },
        icon: "database"
      }, {
        name: { en: "Application Integrations", tr: "Uygulama Entegrasyonları" },
        unit: { en: "custom pricing", tr: "özel fiyatlama" },
        icon: "app"
      },
    ]
  },
  unitEconomics: {
    title: { en: "Unit Economics — by Customer Type", tr: "Birim Ekonomisi — Müşteri Türüne Göre Hedefler (Yıllık)" },
    subtitle: { en: "Targets vary by sector and implementation scope", tr: "Aralıklar ilk yıl hedefleridir; sektöre ve satın alma süreçlerine göre değişebilir" },
    segments: [
      {
        name: { en: "Basic", tr: "Temel" },
        subtitle: { en: "Small Business", tr: "Küçük İşletme" },
        acv: "$24K",
        detail: { en: "ACV Range", tr: "ACV Aralığı" },
        salesCycle: { en: "Sales cycle: 4-8 weeks", tr: "Satış döngüsü: 4-8 hafta" },
        cac: { en: "CAC payback: 6-12 months", tr: "CAC geri ödeme: 6-12 ay" }
      },
      {
        name: { en: "Pro", tr: "Pro" },
        subtitle: { en: "Medium Business", tr: "Orta İşletme" },
        acv: "$72K",
        detail: { en: "ACV Range", tr: "ACV Aralığı" },
        salesCycle: { en: "Purchase: 1-3 weeks", tr: "Satın alma: 1-3 hafta" },
        cac: { en: "CAC payback: 9-15 months", tr: "CAC geri ödeme: 9-15 ay" }
      },
      {
        name: { en: "Enterprise", tr: "Kurumsal" },
        subtitle: { en: "1000+ employees", tr: "1000+ çalışan" },
        acv: "$144K",
        detail: { en: "ACV Range", tr: "ACV Aralığı" },
        salesCycle: { en: "Sales cycle: 9-15 months", tr: "Satış döngüsü: 9-15 ay" },
        cac: { en: "CAC payback: 12-18 months", tr: "CAC geri ödeme: 12-18 ay" }
      }
    ]
  },
  achievements: {
    title: { en: "Xong's Target Achievements", tr: "Xong'nin Kazandığı Alanlar" },
    next12Months: {
      title: { en: "Next 12 Months", tr: "Önümüzdeki 12 Ay" },
      items: [
        {
          icon: "dollar-sign",
          title: { en: "Finance Operations", tr: "Finans Operasyonları" },
          subtitle: { en: "AP/AR, reconciliations, payouts", tr: "AP/AR, mutabakatlar, ödemeler" }
        },
        {
          icon: "shield-check",
          title: { en: "Onboarding & KYC", tr: "Onboarding & KYC" },
          subtitle: { en: "Document checks, approvals", tr: "Belge kontrolleri, onaylar" }
        },
        {
          icon: "arrow-right-circle",
          title: { en: "Order-to-Cash", tr: "Siparişten Tahsilata" },
          subtitle: { en: "Quote → invoice → collections", tr: "Teklif → fatura → tahsilat" }
        },
        {
          icon: "computer",
          title: { en: "IT/Service Operations", tr: "BT/Servis Operasyonları" },
          subtitle: { en: "Ticket triage, issue entry-exit", tr: "Talep triage'ı, işe giriş-çıkış" }
        }, 
       {
        icon: "alert-triangle",
        title: { en: "Enterprise Production Tracking", tr: "Üretim Süreç Takibi" },
        subtitle: {
          en: "Ticket triage, issue entry/exit logging, stage-by-stage tracking, SLA alerts, and throughput KPIs.",
          tr: "Talep triage'ı, işe giriş-çıkış kaydı, aşama aşama takip, SLA uyarıları ve verimlilik KPI'ları."
        }
      }


      ],
    },
    next12to24Months: {
      title: { en: "Next 12-24 Months", tr: "Sonraki 12-24 Ay" },
      items: [
        {
          icon: "handshake",
          title: { en: "Vendor Onboarding", tr: "Tedarikçi Onboarding" },
          subtitle: { en: "Procure-to-Pay (P2P)", tr: "Satınalmadan Ödemeye (P2P)" }
        },
        {
          icon: "file-text",
          title: { en: "Claims & Case Processing", tr: "Hasar & Vaka İşleme" },
          subtitle: { en: "Compliance & Audit", tr: "Uyum & Denetim" }
        },
        {
          icon: "headphones",
          title: { en: "Customer Support Operations", tr: "Müşteri Destek Operasyonları" },
          subtitle: { en: "Sales/RevOps", tr: "Satış/RevOps" }
        },
        {
          icon: "megaphone",
          title: { en: "Marketing Operations", tr: "Pazarlama Operasyonları" },
          subtitle: { en: "E-commerce/Marketplace Operations", tr: "E-ticaret/Pazaryeri Operasyonları" }
        },
        {
          icon: "alert-triangle",
          title: { en: "Risk/Fraud & Disputes", tr: "Risk/Sahteciliğe & İtirazlar" },
          subtitle: { en: "HR Operations", tr: "İK Operasyonları" }
        }
      ]
    }
  },
  roadmap: {
    title: { en: "Release Roadmap — Months 0-12 (First Version at 6-10 months)", tr: "Sürüm Yol Haritası — Ay 0-12 (İlk Sürüm 6-10. ayda)" },
    subtitle: { en: "Design-partner pilots → MVP → general availability → scale", tr: "Tasarım ortağı pilotları → MVP → genel erişim → ölçek" },
    phases: [
      {
        title: { en: "Now: Company Formation", tr: "Şimdi: Şirket Kurma" },
        period: "Now",
        items: [
          { en: "• Company formation & banking", tr: "• Şirket kurma ve bankacılık" },
          { en: "• Initial hiring & asset recruitment", tr: "• İlk işe alma ve varlık edinme" }
        ],
        color: "primary"
      },
      {
        title: { en: "0-2: Build Core Pipeline", tr: "0-2: Çekirdek Pipeline Kur" },
        period: "0-2",
        items: [
          { en: "• Build core pipeline", tr: "• Çekirdek pipeline kur" },
          { en: "• Start pilots", tr: "• Pilotları başlat" },
          { en: "• Set up Lab environment", tr: "• Lab ortamını kur" }
        ],
        color: "success"
      },
      {
        title: { en: "4-6: General Availability for Pilots", tr: "4-6: Pilotlar için Genel Erişim" },
        period: "4-6",
        items: [
          { en: "• General availability for pilots", tr: "• Pilotlar için genel erişim" },
          { en: "• Customer onboarding playbooks", tr: "• Müşteri onboarding kılavuzları" }
        ],
        color: "accent"
      },
      {
        title: { en: "6-10: First Version (GA)", tr: "6-10: İlk Sürüm (GA)" },
        period: "6-10",
        items: [
          { en: "• First Version (GA)", tr: "• İlk Sürüm (GA)" },
          { en: "• Pipeline Manager", tr: "• Pipeline Manager" }
        ],
        color: "purple"
      },
      {
        title: { en: "10-12: Scale Go-lives", tr: "10-12: Go-live'ları Ölçekle" },
        period: "10-12",
        items: [
          { en: "• Scale go-lives", tr: "• Go-live'ları ölçekle" },
          { en: "• Flow marketplace (beta)", tr: "• Akış pazarı (beta)" }
        ],
        color: "indigo"
      }
    ]
  },
  kpis: {
    title: { en: "Key Performance Indicators — Months 1-12", tr: "Temel Performans Göstergeleri — Ay 1-12" },
    subtitle: { en: "Targets are first-year goals; may vary by sector/implementation", tr: "Hedefler ilk yıl içindir; sektöre/düzenlemelere bağlı olarak değişebilir" },
    metrics: [
      {
        icon: "flask",
        title: { en: "Pilot → Paid transition", tr: "Pilot → Ücretli üretime geçiş" },
        value: "≥75%",
        description: { en: "Success rate", tr: "Başarı oranı" }
      },
      {
        icon: "zap",
        title: { en: "First value access time", tr: "İlk değere erişim süresi" },
        value: "≤6 ay",
        description: { en: "Time to value", tr: "Değer süresi" }
      },
      {
        icon: "shield-check",
        title: { en: "Output accuracy (priority areas)", tr: "Çıkarım doğruluğu (öncelikli alanlar)" },
        value: "%97",
        description: { en: "Accuracy target", tr: "Doğruluk hedefi" }
      },
      {
        icon: "clock",
        title: { en: "Customer acquisition time", tr: "Müşteri devreye alma süresi" },
        value: "<2 hours",
        description: { en: "Setup time", tr: "Kurulum süresi" }
      },
      {
        icon: "trending-up",
        title: { en: "Gross margin", tr: "Brüt marj" },
        value: "≥70%",
        description: { en: "Target margin", tr: "Hedef marj" }
      },
      {
        icon: "refresh-cw",
        title: { en: "Net revenue retention (12 months)", tr: "Net gelir tutma (12 ay)" },
        value: "≥120%",
        description: { en: "Growth rate", tr: "Büyüme oranı" }
      }
    ]
  },
  risks: {
    title: { en: "Risks & Mitigations — Readiness Heat Map", tr: "Riskler & Önlemler — Hazırlık Isı Haritası" },
    categories: [
      {
        level: "high",
        title: { en: "Data security and data placement", tr: "Veri güvenliği ve veri yerleşimi" },
        mitigation: { en: "On-premise or private cloud (VPC); expected/active encryption; data placement controllers", tr: "Yerinde (on-prem) veya özel sanal bulut (VPC); beklemede/aktarımda şifreleme; veri yerleşimi kontrolleri" },
        color: "red"
      },
      {
        level: "high",
        title: { en: "Model accuracy and continuity", tr: "Model doğruluğu ve sürükleme" },
        mitigation: { en: "Human-in-the-loop (HITL) oversight; benchmark sets; continuous evaluation/monitoring", tr: "İnsan denetimli (HITL) gözden geçirme; kıyas setleri; sürekli değerlendirme/izleme" },
        color: "red"
      },
      {
        level: "medium",
        title: { en: "Enterprise sales cycle length", tr: "Kurumsal satış döngülerinin uzunluğu" },
        mitigation: { en: "Design-centric pilots, executive sponsorship; public (wedge) workflows", tr: "Tasarım odaklı pilotlar, yönetici sponsorluğu; kama (wedge) iş akışları" },
        color: "orange"
      },
      {
        level: "medium",
        title: { en: "Infrastructure cost overruns", tr: "Altyapı maliyet sıçramaları" },
        mitigation: { en: "Usage-based pricing; transitional (pass-through) accounting; automatic scaling", tr: "Kullanıma bağlı fiyatlama; geçişli (pass-through) hesaplama; otomatik ölçekleme" },
        color: "orange"
      },
      {
        level: "low",
        title: { en: "ERP/BPM integration complexity", tr: "ERP/BPM entegrasyon karmaşıklığı" },
        mitigation: { en: "Current integration strength does not reflect internally; mitigations are implemented or planned", tr: "Şiddet düzeyi, dahili değerlendirmemizi yansıtır; önlemler uygulanmış veya planlanmıştır" },
        color: "yellow"
      }
    ]
  },
  financial: {
    title: { en: "Use of Funds — Pre-Seed $750K", tr: "Fon Kullanımı — Ön Tohum $740k" },
    subtitle: { en: "Where the money goes", tr: "Paranın gittiği yer" },
    breakdown: [
      {
        category: { en: "Hardware & Infrastructure", tr: "Donanım & Altyapı" },
        percentage: 44,
        amount: "$300K",
        description: { en: "4 GPUs × $75K + tax; on-prem development infrastructure", tr: "4 GPU × $75K + vergi; on-prem geliştirme altyapısı" }
      },
      {
        category: { en: "Team (AI/ML)", tr: "Ekip (AI/ML)" },
        percentage: 48,
        amount: "$321K",
        description: { en: "2 Junior + 3 Senior AI Engineers + 2 Founders", tr: "2 Junior + 3 Senior AI Mühendisi + 2 Kurucu" }
      },
      {
        category: { en: "Operations", tr: "Operasyon" },
        percentage: 8,
        amount: "$54K",
        description: { en: "Data center, hardware environment, general expenses", tr: "Veri merkezi, donanım ortamı, genel giderler" }
      }
    ],
    outcome: { 
      en: "Build core product; 3 pilot customers; AI infrastructure", 
      tr: "Çekirdek ürün kur; 3 pilot müşteri; AI altyapısı" 
    },
    timeline: { 
      en: "First revenue at month 9 (May 2026)", 
      tr: "İlk gelir 9. ayda (Mayıs 2026)" 
    },
    kpis: [
      {
        value: "$22K",
        label: { en: "First Month Revenue", tr: "İlk Ay Gelir" }
      },
      {
        value: "3",
        label: { en: "Pilot Companies", tr: "Pilot Şirketler" }
      },
      {
        value: "12",
        label: { en: "Month Runway", tr: "Ay Pist" }
      },
      {
        value: "48%",
        label: { en: "Team Investment", tr: "Takım Yatırımı" }
      }
    ]
  },
  goToMarket: {
    title: { en: "Go-to-Market Funnel — Pilots to Paid Logos", tr: "Pazara Açılım Hunisi — Pilotlardan Ücretli Logolara" },
    subtitle: { en: "Design-partner pilots → MVP → general availability → scale", tr: "Tasarım ortağı pilotları → MVP → genel erişim → ölçek" },
    funnel: [
      {
        stage: { en: "Pilots", tr: "Pilotlar" },
        count: 4,
        description: { en: "Pilot length: 18-24 weeks", tr: "Pilot süresi: 18-24 hafta" }
      },
      {
        stage: { en: "Go-lives", tr: "Canlıya Geçiş" },
        count: 3,
        description: { en: "6-9 months", tr: "6-9 ay" },
        conversionRate: 400
      },
      {
        stage: { en: "Paid Logos", tr: "Müşteri Sayısı" },
        count: "8-12",
        description: { en: "Go to Market", tr: "Markete Açılma" }
      }
    ],
    kpis: [
      {
        metric: { en: "Time-to-first-value", tr: "İlk değere ulaşma süresi" },
        value: { en: "after 6 months", tr: "6 ay sonra" }
      },
      {
        metric: { en: "Profitability Threshold", tr: "Kârlılık Eşiği" },
        value: { en: "after 10-12 months", tr: "10-12 ay sonra" }
      }
    ]
  }
};

// Export the presentation data
export const presentationData = basePresentationData;

// Create a deep copy function for versioning
export const createPresentationCopy = () => {
  return JSON.parse(JSON.stringify(basePresentationData));
};

// Version-aware presentation data loader
export const getVersionData = (versionId?: string) => {
  // For now, return the base data
  // Later this will load from the selected version
  return presentationData;
};