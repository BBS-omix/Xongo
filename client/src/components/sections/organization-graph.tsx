import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Users, Briefcase, GitBranch, ClipboardList, Cpu, ShieldCheck, Bot, Code2,
  Settings, Coins, Megaphone, Wrench, Headphones, ZoomIn, ZoomOut, Maximize2, Minimize2, Globe
} from "lucide-react";

/* ========================= Types & helpers ========================= */
type Lang = "tr" | "en";
type YearKey = "2026" | "2027" | "2028";
type Group = "dev" | "ops" | "finance" | "marketing" | "maintenance" | "cs";
type NodeType =
  | "founder" | "consultant" | "lead" | "pm"
  | "engSenior" | "engJunior"
  | "aiManager" | "validator" | "agent";

type Node = {
  id: string;
  type: NodeType;
  layer: number;
  label: { tr: string; en: string };
  sub?: { tr: string; en: string };
  group?: Group;
};
type Link = { from: string; to: string };

const T = (l: Lang, tr: string, en: string) => (l === "tr" ? tr : en);

/* ========================= Category colors (HUMAN vs AI) ========================= */
/* One look = humans (emerald), another look = AI (fuchsia). */
const HUMAN_TYPES: ReadonlyArray<NodeType> = ["founder", "consultant", "lead", "pm", "engSenior", "engJunior"];
const isHuman = (t: NodeType) => HUMAN_TYPES.includes(t);
const categoryOf = (t: NodeType) => (isHuman(t) ? "human" as const : "ai" as const);

const CAT = {
  human: {
    fill: "bg-emerald-600",
    ring: "rgba(16,185,129,0.35)", // emerald-500-ish
    tag: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  ai: {
    fill: "bg-fuchsia-600",
    ring: "rgba(217,70,239,0.35)", // fuchsia-500-ish
    tag: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
  }
} as const;

/* Subtle banding for rows */
const LAYER_BANDS = ["bg-slate-50","bg-slate-100","bg-slate-50","bg-slate-100","bg-amber-50","bg-slate-50"];

/* Icons */
function Icon({ type, group }: { type: NodeType; group?: Group }) {
  const cls = "w-4 h-4 text-white";
  switch (type) {
    case "founder": return <Users className={cls} />;
    case "consultant": return <Briefcase className={cls} />;
    case "lead": return <GitBranch className={cls} />;
    case "pm": return <ClipboardList className={cls} />;
    case "engSenior":
    case "engJunior": return <Code2 className={cls} />;
    case "aiManager":
      if (group === "dev") return <Cpu className={cls} />;
      if (group === "ops") return <Settings className={cls} />;
      if (group === "finance") return <Coins className={cls} />;
      if (group === "marketing") return <Megaphone className={cls} />;
      if (group === "maintenance") return <Wrench className={cls} />;
      if (group === "cs") return <Headphones className={cls} />;
      return <Cpu className={cls} />;
    case "validator": return <ShieldCheck className={cls} />;
    case "agent": return <Bot className={cls} />;
  }
}

/* ========================= Data builder ========================= */
// 6 domains (includes Maintenance & Customer Services)
const mgrs: Array<{ id: string; group: Group; tr: string; en: string; trSub: string; enSub: string }> = [
  { id:"mgr-dev", group:"dev",        tr:"AI Yöneticisi — Geliştirme",         en:"AI Manager — Development",       trSub:"Kod üretimi, triage", enSub:"Code-gen, triage" },
  { id:"mgr-ops", group:"ops",        tr:"AI Yöneticisi — Operasyon",          en:"AI Manager — Operations",        trSub:"SRE & olay", enSub:"SRE & incidents" },
  { id:"mgr-fin", group:"finance",    tr:"AI Yöneticisi — Finans",             en:"AI Manager — Finance",           trSub:"Tahmin & faturalar", enSub:"Forecast & billing" },
  { id:"mgr-mkt", group:"marketing",  tr:"AI Yöneticisi — Pazarlama",          en:"AI Manager — Marketing",         trSub:"İçerik & A/B", enSub:"Content & A/B" },
  { id:"mgr-mnt", group:"maintenance",tr:"AI Yöneticisi — Bakım",              en:"AI Manager — Maintenance",       trSub:"Planlı bakım & arıza", enSub:"Maintenance & faults" },
  { id:"mgr-cs",  group:"cs",         tr:"AI Yöneticisi — Müşteri Hizmetleri", en:"AI Manager — Customer Services", trSub:"Çağrı & geri bildirim", enSub:"Calls & feedback" },
];

function buildYear(year: YearKey, lang: Lang) {
  const nodes: Node[] = [];
  const links: Link[] = [];

  // Founders / consultant
  const founders: Node[] = [
    { id:"berk",  type:"founder",   layer:0, label:{tr:"Berk Sezim",en:"Berk Sezim"}, sub:{tr:"Kurucu Ortak",en:"Co-Founder"} },
    { id:"cagan", type:"founder",   layer:0, label:{tr:"Çağan Sezim",en:"Çağan Sezim"}, sub:{tr:"Kurucu Ortak (CTO)",en:"Co-Founder (CTO)"} },
    { id:"hakan", type:"consultant",layer:0, label:{tr:"Hakan Oktay",en:"Hakan Oktay"}, sub:{tr:"Danışman",en:"Consultant"} },
  ];
  nodes.push(...founders);

  // Leaders / PM (2027+)
  const leaders: Node[] = [];
  if (year !== "2026") {
    leaders.push(
      { id:"tl-a", type:"lead", layer:1, label:{tr:"Takım Lideri — A",en:"Team Lead — A"}, sub:{tr:"Ekip koordinasyonu",en:"Squad coordination"} },
      { id:"tl-b", type:"lead", layer:1, label:{tr:"Takım Lideri — B",en:"Team Lead — B"}, sub:{tr:"Ekip koordinasyonu",en:"Squad coordination"} },
      { id:"pmo",  type:"pm",   layer:1, label:{tr:"Proje Yöneticisi (PMO)",en:"Project Manager (PMO)"}, sub:{tr:"Planlama & teslim",en:"Planning & delivery"} },
    );
    if (year === "2028") {
      leaders.push(
        { id:"tl-c", type:"lead", layer:1, label:{tr:"Takım Lideri — C",en:"Team Lead — C"}, sub:{tr:"Yeni ekip",en:"New squad"} },
        { id:"tl-d", type:"lead", layer:1, label:{tr:"Takım Lideri — D",en:"Team Lead — D"}, sub:{tr:"Yeni ekip",en:"New squad"} },
      );
    }
    nodes.push(...leaders);
    founders.forEach(f => leaders.forEach(l => links.push({ from:f.id, to:l.id })));
  }

  // Engineers
  const engLayer = year === "2026" ? 1 : 2;
  const baseEng: Node[] = [
    { id:"jun1", type:"engJunior", layer:engLayer, label:{tr:"Junior AI Mühendisi #1",en:"Junior AI Engineer #1"}, sub:{tr:"Geliştirme & test",en:"Build & test"} },
    { id:"jun2", type:"engJunior", layer:engLayer, label:{tr:"Junior AI Mühendisi #2",en:"Junior AI Engineer #2"}, sub:{tr:"Geliştirme & test",en:"Build & test"} },
    { id:"sen1", type:"engSenior", layer:engLayer, label:{tr:"Kıdemli AI Mühendisi #1",en:"Senior AI Engineer #1"}, sub:{tr:"R&D, entegrasyon",en:"R&D, integration"} },
    { id:"sen2", type:"engSenior", layer:engLayer, label:{tr:"Kıdemli AI Mühendisi #2",en:"Senior AI Engineer #2"}, sub:{tr:"R&D, entegrasyon",en:"R&D, integration"} },
    { id:"sen3", type:"engSenior", layer:engLayer, label:{tr:"Kıdemli AI Mühendisi #3",en:"Senior AI Engineer #3"}, sub:{tr:"R&D, entegrasyon",en:"R&D, integration"} },
  ];
  const engs: Node[] = [...baseEng];
  if (year !== "2026") {
    engs.push(
      { id:"sen4", type:"engSenior", layer:engLayer, label:{tr:"Kıdemli AI Mühendisi #4",en:"Senior AI Engineer #4"}, sub:{tr:"Özelleştirme",en:"Customization"} },
      { id:"sen5", type:"engSenior", layer:engLayer, label:{tr:"Kıdemli AI Mühendisi #5",en:"Senior AI Engineer #5"}, sub:{tr:"Özelleştirme",en:"Customization"} },
      { id:"sen6", type:"engSenior", layer:engLayer, label:{tr:"Kıdemli AI Mühendisi #6",en:"Senior AI Engineer #6"}, sub:{tr:"Özelleştirme",en:"Customization"} },
    );
  }
  if (year === "2028") {
    for (let i=7;i<=14;i++){
      engs.push({
        id:`sen${i}`, type:"engSenior", layer:engLayer,
        label:{tr:`Kıdemli AI Mühendisi #${i}`,en:`Senior AI Engineer #${i}`},
        sub:{tr:"Özelleştirme",en:"Customization"}
      });
    }
  }
  nodes.push(...engs);

  // Map engineers to leads (clean)
  if (leaders.length) {
    const groupA = ["jun1","sen1","sen2","sen7","sen8"];
    const groupB = engs.map(e=>e.id).filter(id => !groupA.includes(id)).slice(0, Math.ceil((engs.length-groupA.length)/2));
    const groupC = engs.map(e=>e.id).filter(id => !groupA.includes(id) && !groupB.includes(id));
    const tlA = leaders.find(l=>l.id==="tl-a"); const tlB = leaders.find(l=>l.id==="tl-b");
    const tlC = leaders.find(l=>l.id==="tl-c"); const tlD = leaders.find(l=>l.id==="tl-d");
    if (tlA) groupA.forEach(id=> links.push({ from: tlA.id, to: id }));
    if (tlB) groupB.forEach(id=> links.push({ from: tlB.id, to: id }));
    if (tlC) groupC.filter((_,i)=>i%2===0).forEach(id=> links.push({ from: tlC.id, to: id }));
    if (tlD) groupC.filter((_,i)=>i%2===1).forEach(id=> links.push({ from: tlD.id, to: id }));
  } else {
    founders.forEach(f => engs.forEach(e => links.push({ from:f.id, to:e.id })));
  }

  // AI Managers
  const mgrLayer = engLayer + 1;
  const managers: Node[] = mgrs.map(m => ({
    id:m.id, type:"aiManager", layer:mgrLayer, group:m.group,
    label:{tr:m.tr, en:m.en}, sub:{tr:m.trSub, en:m.enSub}
  }));
  nodes.push(...managers);

  // PM connects to managers
  const pmo = leaders.find(l=>l.type==="pm");
  if (pmo) managers.forEach(m => links.push({ from: pmo.id, to: m.id }));

  // Engineer → domain manager
  const route: Record<string, Group> = {
    jun1:"dev", jun2:"ops",
    sen1:"dev", sen2:"ops", sen3:"finance",
    sen4:"marketing", sen5:"maintenance", sen6:"cs",
    sen7:"dev", sen8:"ops", sen9:"finance", sen10:"marketing",
    sen11:"maintenance", sen12:"cs", sen13:"dev", sen14:"ops"
  };
  engs.forEach(e=>{
    const g = route[e.id] ?? "dev";
    const m = managers.find(mm=>mm.group===g)!;
    links.push({ from:e.id, to:m.id });
  });

  // Validators & Agents (2 for 2026, 3 for 2027/28)
  const valLayer = mgrLayer + 1;
  const agtLayer = valLayer + 1;
  const agentsPerManager = year === "2026" ? 2 : 3;

  managers.forEach(m=>{
    const val: Node = {
      id:`val-${m.id}`, type:"validator", layer:valLayer, group:m.group,
      label:{tr:"Doğrulayıcı",en:"Validator"},
      sub:{tr:"Politika & kalite kapıları", en:"Policy & quality gates"}
    };
    nodes.push(val); links.push({ from:m.id, to:val.id });

    const labelPack: Record<Group,{tr:string;en:string}> = {
      dev:{tr:"Kod Üretimi Ajanı",en:"Codegen Agent"},
      ops:{tr:"Ticket/İş Akışı Ajanı",en:"Ticket/Workflow Agent"},
      finance:{tr:"Finans Analiz Ajanı",en:"Financial Analysis Agent"},
      marketing:{tr:"İçerik/A-B Ajanı",en:"Content/A-B Agent"},
      maintenance:{tr:"Bakım Planlama Ajanı",en:"Maintenance Planner Agent"},
      cs:{tr:"Müşteri Destek Ajanı",en:"Customer Support Agent"},
    };
    for(let i=1;i<=agentsPerManager;i++){
      const ag: Node = {
        id:`agt-${m.id}-${i}`, type:"agent", layer:agtLayer, group:m.group,
        label:{ tr:`${labelPack[m.group!].tr} #${i}`, en:`${labelPack[m.group!].en} #${i}` },
        sub:{ tr:"Paralel yürütme", en:"Parallel execution" }
      };
      nodes.push(ag);
      links.push({ from: val.id, to: ag.id });
    }
  });

  return { nodes, links, layers: agtLayer + 1 };
}

/* ========================= Layout (centered) ========================= */
const LAYER_GAP = 130;
const BASE_COL_GAP = 180;
const MARGIN_X = 120;

type Pos = { x:number; y:number };

function layoutByLayers(nodes: Node[], width: number): Record<string, Pos> {
  const by = new Map<number, Node[]>();
  nodes.forEach(n => {
    const arr = by.get(n.layer) ?? [];
    arr.push(n); by.set(n.layer, arr);
  });

  const pos: Record<string, Pos> = {};
  const maxL = Math.max(...Array.from(by.keys()));

  for (let r=0; r<=maxL; r++){
    const row = (by.get(r) ?? []).slice();
    const order: Group[] = ["dev","ops","finance","marketing","maintenance","cs"];
    row.sort((a,b)=>{
      const ai = a.group ? order.indexOf(a.group) : -1;
      const bi = b.group ? order.indexOf(b.group) : -1;
      if (ai !== bi) return ai - bi;
      return a.id.localeCompare(b.id);
    });

    const n = row.length || 1;
    const gap = n>1 ? Math.min(BASE_COL_GAP, (width - MARGIN_X*2) / (n-1)) : 0;
    const startX = (width - (gap*(n-1))) / 2; // row centered
    const y = 90 + r*LAYER_GAP;

    row.forEach((node,i)=> pos[node.id] = { x: startX + i*gap, y });
  }
  return pos;
}

/* ========================= Pop card ========================= */
function PopCard({ anchor, node, lang }: { anchor: DOMRect | null; node: Node | null; lang: Lang }) {
  if (!anchor || !node) return null;
  const left = anchor.left + anchor.width/2 - 160;
  const top  = anchor.top - 130;
  const cat = categoryOf(node.type);

  return (
    <div className="fixed z-[100] pointer-events-none" style={{ left, top }}>
      <div className="w-[320px] rounded-xl bg-white shadow-2xl ring-1 ring-black/10">
        <div className="flex items-center gap-3 p-3 border-b border-slate-100">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${CAT[cat].fill}`}>
            <Icon type={node.type} group={node.group}/>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-slate-900">{node.label[lang]}</div>
            {node.sub && <div className="text-[11px] text-slate-600">{node.sub[lang]}</div>}
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${CAT[cat].tag}`}>
            {cat === "human" ? T(lang,"İnsan","Human") : "AI"}
          </span>
        </div>
        <div className="p-3 text-[11px] text-slate-700 space-y-1">
          <div className="flex flex-wrap gap-1">
            {node.group && <span className="px-2 py-0.5 rounded bg-slate-50 border">{T(lang,"Alan","Domain")}: {node.group}</span>}
            <span className="px-2 py-0.5 rounded bg-slate-50 border">{T(lang,"Tip","Type")}: {node.type}</span>
            <span className="px-2 py-0.5 rounded bg-slate-50 border">{T(lang,"Katman","Layer")}: {node.layer+1}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {T(lang,"Görev: İş akışlarını sade ve izlenebilir tutar.","Role: Keeps workflows simple and traceable.")}
          </div>
        </div>
      </div>
      <div className="fixed w-3 h-3 bg-white rotate-45 -mt-2 ml-[156px] ring-1 ring-black/10"/>
    </div>
  );
}

/* ========================= Main component ========================= */
export function OrganizationGraph(){
  const [lang, setLang] = useState<Lang>("tr");
  const [year, setYear] = useState<YearKey>("2026");
  const [zoom, setZoom] = useState(1);
  const [isFull, setIsFull] = useState(false);

  const wrapRef = useRef<HTMLDivElement|null>(null);
  const [size, setSize] = useState({ w: 1200, h: 720 });

  const { nodes, links } = useMemo(()=>buildYear(year, lang), [year, lang]);

  // live category counts
  const counts = useMemo(()=>{
    let human = 0, ai = 0;
    nodes.forEach(n => isHuman(n.type) ? human++ : ai++);
    return { human, ai };
  },[nodes]);

  // Size: clamp to wrapper width, then center via flex
  useEffect(()=>{
    const recompute = ()=>{
      const wrapW = Math.max(800, wrapRef.current?.clientWidth ?? 1200);
      const countsByLayer: Record<number, number> = {};
      nodes.forEach(n => countsByLayer[n.layer] = (countsByLayer[n.layer] ?? 0) + 1);

      // width stays within visible wrapper (minus padding) and never exceeds 1400
      const w = Math.min(Math.max(900, wrapW - 32), 1400);
      const h = 120 + (Math.max(...Object.keys(countsByLayer).map(Number))+1) * LAYER_GAP + 70;
      setSize({ w, h });
    };
    recompute();
    window.addEventListener("resize", recompute);
    return ()=>window.removeEventListener("resize", recompute);
  },[nodes]);

  const pos = useMemo(()=>layoutByLayers(nodes, size.w), [nodes, size.w]);

  // Auto-fit vertically
  useEffect(()=>{
    const fit = ()=>{
      const wrap = wrapRef.current;
      if (!wrap) return;
      const pad = 40;
      const sY = (wrap.clientHeight - pad) / size.h;
      const s = Math.max(0.8, Math.min(1.1, sY));
      setZoom(+s.toFixed(2));
    };
    fit();
    const t = setTimeout(fit, 40);
    return ()=>clearTimeout(t);
  },[size.h, year, isFull]);

  // hover pop
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const R = (t:NodeType)=> t==="founder"||t==="consultant" ? 22
    : t==="lead"||t==="pm" ? 20
    : t==="aiManager" ? 18
    : t==="validator" ? 16
    : 14;

  return (
    <section className={`${isFull ? "fixed inset-0 z-[200] bg-white" : "relative"} w-full`}>
      {/* Top bar with the modern title */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-4 justify-between">
          {/* Title block */}
          <div className="min-w-[260px]">
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-full px-3 py-1.5 mb-2">
              <Bot className="w-4 h-4 text-sky-700" />
              <span className="text-xs text-sky-700">
                {T(lang, "İnsan + AI • Çok Katmanlı", "Human + AI • Layered View")}
              </span>
            </div>
            <h2 className="font-poppins font-extrabold text-2xl md:text-3xl text-slate-900 leading-tight">
              {T(lang, "Organizasyon Şeması", "Organization Scheme")}
            </h2>
            <div className="text-xs md:text-sm text-slate-600">
              {T(
                lang,
                "Katmanlar: Kurucular → (Lider/PM) → Mühendisler → AI Yöneticileri → Doğrulayıcılar → AI Çalışanlar",
                "Layers: Founders → (Lead/PM) → Engineers → AI Managers → Validators → Agents"
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 ml-auto">
            {(["2026","2027","2028"] as YearKey[]).map(y=>(
              <button key={y} onClick={()=>setYear(y)}
                className={`px-3 py-1.5 rounded-full text-sm border ${year===y? "bg-slate-900 text-white border-slate-900":"bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}>
                {y}
              </button>
            ))}

            {/* Counters: clarify headcount vs agents */}
            <div className="ml-2 hidden sm:flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border bg-white text-emerald-700 border-emerald-200">
                • {T(lang,"İnsan","Human")}: {counts.human}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border bg-white text-fuchsia-700 border-fuchsia-200">
                • AI: {counts.ai}
              </span>
            </div>

            <div className="ml-2 flex items-center gap-1 border rounded-full px-1 py-0.5">
              <button className="p-1 hover:bg-slate-100 rounded-full" onClick={()=>setZoom(z=>Math.max(0.7, +(z-0.1).toFixed(2)))} aria-label="Zoom out"><ZoomOut className="w-4 h-4"/></button>
              <div className="px-2 text-xs tabular-nums">{Math.round(zoom*100)}%</div>
              <button className="p-1 hover:bg-slate-100 rounded-full" onClick={()=>setZoom(z=>Math.min(1.4, +(z+0.1).toFixed(2)))} aria-label="Zoom in"><ZoomIn className="w-4 h-4"/></button>
            </div>

            <button
              onClick={()=>{
                const wrap = wrapRef.current; if(!wrap) return;
                const pad = 40;
                const sY = (wrap.clientHeight - pad) / size.h;
                setZoom(+Math.max(0.8, Math.min(1.1, sY)).toFixed(2));
              }}
              className="px-3 py-1.5 rounded-full border bg-white hover:bg-slate-50 text-sm"
            >
              {T(lang,"Sığdır","Fit")}
            </button>

            <button onClick={()=>setIsFull(v=>!v)}
              className="px-3 py-1.5 rounded-full border bg-white hover:bg-slate-50 text-sm inline-flex items-center gap-1">
              {isFull ? <Minimize2 className="w-4 h-4"/> : <Maximize2 className="w-4 h-4"/>}
              {isFull ? T(lang,"Pencereden Çık","Exit Full") : T(lang,"Tam Ekran","Fullscreen")}
            </button>

            <button onClick={()=>setLang(l=>l==="tr"?"en":"tr")}
              className="px-3 py-1.5 rounded-full border bg-white hover:bg-slate-50 text-sm inline-flex items-center gap-1">
              <Globe className="w-4 h-4"/>{lang.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas wrapper (fills page height) */}
      <div ref={wrapRef} className="w-full h-[calc(100vh-132px)] overflow-auto">
        {/* Flex center guarantees perfect horizontal centering */}
        <div className="w-full flex justify-center px-4 pt-4 pb-10">
          <div className="relative rounded-3xl ring-1 ring-slate-200 bg-white overflow-visible"
               style={{ width: size.w, height: size.h }}>
            {/* Layer bands */}
            {Array.from({length: Math.max(...nodes.map(n=>n.layer))+1}).map((_,i)=>(
              <div key={i}
                   className={`absolute left-0 right-0 ${LAYER_BANDS[i % LAYER_BANDS.length]}`}
                   style={{ top: 80 + i*LAYER_GAP, height: LAYER_GAP }}/>
            ))}

            <div className="relative overflow-visible">
              <svg width={size.w} height={size.h}
                   viewBox={`0 0 ${size.w} ${size.h}`}
                   className="block overflow-visible"
                   style={{ transform:`scale(${zoom})`, transformOrigin:"center top" }}>
                {/* Links */}
                <g>
                  {links.map((l,i)=>{
                    const A = pos[l.from]; const B = pos[l.to];
                    if (!A || !B) return null;
                    const dx = (B.x - A.x) * 0.35;
                    const path = `M ${A.x},${A.y} C ${A.x+dx},${A.y} ${B.x-dx},${B.y} ${B.x},${B.y}`;
                    return <path key={i} d={path} stroke="rgba(100,116,139,0.35)" strokeWidth={1.25} fill="none"/>;
                  })}
                </g>

                {/* Nodes */}
                <g>
                  {nodes.map(n=>{
                    const p = pos[n.id]; if (!p) return null;
                    const r = R(n.type);
                    const cat = categoryOf(n.type);
                    const ringColor = CAT[cat].ring;
                    const fillClass = CAT[cat].fill;

                    return (
                      <g key={n.id} transform={`translate(${p.x},${p.y})`}
                         onMouseEnter={(e)=>{setHoverNode(n); setAnchorRect((e.currentTarget as SVGGElement).getBoundingClientRect());}}
                         onMouseLeave={()=>{setHoverNode(null); setAnchorRect(null);}}
                         className="cursor-default">
                        <circle r={r+6} stroke={ringColor} strokeWidth={6} fill="none"/>
                        <circle r={r} className={`${fillClass} shadow`} />
                        <g transform="translate(-8,-8)">
                          <foreignObject width="16" height="16">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <Icon type={n.type} group={n.group}/>
                            </div>
                          </foreignObject>
                        </g>
                        <text y={r+14} textAnchor="middle" className="fill-slate-800" fontSize={11} fontWeight={600}>
                          {n.label[lang]}
                        </text>
                        {n.sub && <text y={r+26} textAnchor="middle" className="fill-slate-500" fontSize={9}>
                          {n.sub[lang]}
                        </text>}
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Pop card */}
              <PopCard anchor={anchorRect} node={hoverNode} lang={lang}/>
            </div>

            {/* Legend */}
            <div className="px-4 pb-5">
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                {/* Category legend first */}
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"/>
                  {T(lang,"İnsan Roller","Human Roles")}
                </span>
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-600"/>
                  AI
                </span>

                {/* Types list (plain text for clarity) */}
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <Users className="w-3.5 h-3.5"/> {T(lang,"Kurucu","Founder")}
                </span>
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <Briefcase className="w-3.5 h-3.5"/> {T(lang,"Danışman","Consultant")}
                </span>
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <GitBranch className="w-3.5 h-3.5"/> {T(lang,"Takım Lideri","Team Lead")}
                </span>
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <ClipboardList className="w-3.5 h-3.5"/> {T(lang,"Proje Yöneticisi","Project Manager")}
                </span>
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <Code2 className="w-3.5 h-3.5"/> {T(lang,"Mühendis","Engineer")}
                </span>
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <Cpu className="w-3.5 h-3.5"/> {T(lang,"AI Yöneticisi","AI Manager")}
                </span>
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <ShieldCheck className="w-3.5 h-3.5"/> {T(lang,"Doğrulayıcı","Validator")}
                </span>
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border bg-white">
                  <Bot className="w-3.5 h-3.5"/> {T(lang,"AI Çalışanı","AI Agent")}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
