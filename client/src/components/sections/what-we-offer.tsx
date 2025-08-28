import { useState } from 'react';
import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { Card } from '@/components/ui/card';
import { ContentEditor } from '@/components/creator/content-editor';
import { 
  Cloud, Server, HardDrive, Puzzle, Settings, Shield,
  Zap, Database, GitBranch, Eye, FileText, Bot,
  Package, Palette, Wrench, HeartHandshake
} from 'lucide-react';

type Theme = {
  cardGrad: string;   // bg gradient classes
  border: string;     // border color
  ring: string;       // ring hover color
  iconBg: string;     // icon circle bg
  iconText: string;   // icon color
  title: string;      // title color
};

const DEP_THEMES: Record<'pistachio'|'brown'|'blue', Theme> = {
  pistachio: {
    cardGrad: 'bg-gradient-to-b from-lime-50 to-emerald-50',
    border: 'border-lime-200',
    ring: 'ring-lime-300',
    iconBg: 'bg-lime-100',
    iconText: 'text-emerald-700',
    title: 'text-emerald-800',
  },
  brown: {
    cardGrad: 'bg-gradient-to-b from-amber-50 to-stone-50',
    border: 'border-amber-200',
    ring: 'ring-amber-300',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-800',
    title: 'text-stone-800',
  },
  blue: {
    cardGrad: 'bg-gradient-to-b from-sky-50 to-blue-50',
    border: 'border-sky-200',
    ring: 'ring-sky-300',
    iconBg: 'bg-sky-100',
    iconText: 'text-sky-700',
    title: 'text-blue-800',
  },
};

function pickThemeByName(name: string, idx: number): Theme {
  const n = name?.toLowerCase() || '';
  if (n.includes('saas')) return DEP_THEMES.blue;
  if (n.includes('premise') || n.includes('yerinde')) return DEP_THEMES.brown;
  if (n.includes('local') || n.includes('yerel')) return DEP_THEMES.pistachio;
  // rotate if unknown
  const order = [DEP_THEMES.pistachio, DEP_THEMES.brown, DEP_THEMES.blue];
  return order[idx % order.length];
}

export function WhatWeOffer() {
  const { language, complexity, creatorMode } = usePresentationContext();
  const { whatWeOffer } = presentationData;

  // State for editable content
  const [deploymentOptions, setDeploymentOptions] = useState(whatWeOffer.deploymentOptions);
  const [platformComponents, setPlatformComponents] = useState(whatWeOffer.platformCore.components);
  const [addOnItems, setAddOnItems] = useState(whatWeOffer.addOns.items);

  const getDeploymentIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'saas': return <Cloud className="w-8 h-8" />;
      case 'on-premise':
      case 'yerinde': return <Server className="w-8 h-8" />;
      case 'local':
      case 'yerel': return <HardDrive className="w-8 h-8" />;
      default: return <Cloud className="w-8 h-8" />;
    }
  };

  const getPlatformIcon = (component: string) => {
    const name = component.toLowerCase();
    if (name.includes('connector') || name.includes('bağlayıcı')) return <Zap className="w-4 h-4" />;
    if (name.includes('ingestion') || name.includes('parsing') || name.includes('alma') || name.includes('ayrıştırma')) return <FileText className="w-4 h-4" />;
    if (name.includes('vector') || name.includes('graph') || name.includes('vektör') || name.includes('grafik')) return <Database className="w-4 h-4" />;
    if (name.includes('orchestrator') || name.includes('studio') || name.includes('orkestratör')) return <GitBranch className="w-4 h-4" />;
    return <Puzzle className="w-4 h-4" />;
  };

  const getAddonIcon = (addon: string) => {
    const name = addon.toLowerCase();
    if (name.includes('fine-tuning') || name.includes('ince ayar')) return <Wrench className="w-4 h-4" />;
    if (name.includes('llm') || name.includes('agent') || name.includes('özel') || name.includes('ajan')) return <Bot className="w-4 h-4" />;
    if (name.includes('rule') || name.includes('pack') || name.includes('kural') || name.includes('paket')) return <Package className="w-4 h-4" />;
    if (name.includes('integration') || name.includes('entegrasyon')) return <Palette className="w-4 h-4" />;
    if (name.includes('sso') || name.includes('encryption') || name.includes('şifreleme')) return <Eye className="w-4 h-4" />;
    if (name.includes('support') || name.includes('destek')) return <HeartHandshake className="w-4 h-4" />;
    return <Settings className="w-4 h-4" />;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-poppins font-bold text-3xl text-center text-secondary mb-12">
          {whatWeOffer.title[language]}
        </h2>
        
        {/* Deployment Options */}
        <div className="mb-12 relative">
          {creatorMode && (
            <ContentEditor
              title="Deployment Options"
              data={deploymentOptions}
              onSave={(newData: any[]) => setDeploymentOptions(newData)}
              className="absolute top-0 right-0 z-10"
              type="cards"
              fields={[
                { key: 'name', label: 'Name', type: 'text', multilingual: true },
                { key: 'description', label: 'Description', type: 'textarea', multilingual: true },
                { key: 'features', label: 'Features (comma-separated)', type: 'textarea', multilingual: true }
              ]}
              sectionKey="what_we_offer_deployment_options"
            />
          )}
          <h3 className="font-semibold text-xl text-secondary mb-6 text-center">
            {language === 'en' ? 'Deployment Options' : 'Dağıtım Seçenekleri'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deploymentOptions.map((option: any, index: number) => {
              const theme = pickThemeByName(option.name?.en ?? '', index);
              return (
                <Card
                  key={index}
                  className={`card-hover rounded-xl p-6 text-center shadow-lg border ${theme.border} ${theme.cardGrad}
                              transition hover:shadow-xl hover:ring-2 ${theme.ring}`}
                >
                  <div className={`w-16 h-16 ${theme.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <div className={theme.iconText}>
                      {getDeploymentIcon(option.name.en)}
                    </div>
                  </div>
                  <h4 className={`font-semibold text-lg mb-2 ${theme.title}`}>
                    {option.name[language]}
                  </h4>
                  <p className="text-gray-700 text-sm mb-4">{option.description[language]}</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {(Array.isArray(option.features) ? option.features : 
                      typeof option.features === 'string' ? 
                        option.features.split(',').map((f: string) => ({ en: f.trim(), tr: f.trim() })) :
                        []
                    ).map((feature: any, featureIndex: number) => (
                      <li key={featureIndex}>• {typeof feature === 'string' ? feature : feature[language]}</li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Core */}
          <Card className="bg-white rounded-xl p-6 shadow-lg relative">
            {creatorMode && (
              <ContentEditor
                title="Platform Components"
                data={platformComponents.map((comp: any, i: number) => ({ id: `comp_${i}`, component: comp }))}
                onSave={(newData) => setPlatformComponents(newData.map((item: any) => item.component))}
                className="absolute top-2 right-2 z-10"
                type="list"
                fields={[
                  { key: 'component', label: 'Component Name', type: 'text', multilingual: true }
                ]}
                sectionKey="what_we_offer_platform_components"
              />
            )}
            <div className="flex items-center mb-4">
              <Puzzle className="w-6 h-6 text-primary mr-3" />
              <h3 className="font-semibold text-lg text-secondary">
                {whatWeOffer.platformCore.title[language]}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {platformComponents.map((component: any, index: number) => (
                <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="text-primary mr-3 flex-shrink-0">
                    {getPlatformIcon(component[language])}
                  </div>
                  <span className="text-sm text-secondary">{component[language]}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Add-ons & Services */}
          <Card className="bg-white rounded-xl p-6 shadow-lg relative">
            {creatorMode && (
              <ContentEditor
                title="Add-ons & Services"
                data={addOnItems.map((item: any, i: number) => ({ id: `addon_${i}`, item }))}
                onSave={(newData) => setAddOnItems(newData.map((entry: any) => entry.item))}
                className="absolute top-2 right-2 z-10"
                type="list"
                fields={[
                  { key: 'item', label: 'Add-on Name', type: 'text', multilingual: true }
                ]}
                sectionKey="what_we_offer_addons"
              />
            )}
            <div className="flex items-center mb-4">
              <Settings className="w-6 h-6 text-success mr-3" />
              <h3 className="font-semibold text-lg text-secondary">
                {whatWeOffer.addOns.title[language]}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {addOnItems.slice(0, complexity === 'basic' ? 3 : addOnItems.length).map((item: any, index: number) => (
                <div key={index} className="group relative bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md border border-green-100">
                  <div className="flex items-center justify-center text-center">
                    <div className="text-success mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {getAddonIcon(item[language])}
                    </div>
                    <span className="text-sm font-medium text-secondary group-hover:text-green-700 transition-colors duration-300">{item[language]}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 to-emerald-400/0 group-hover:from-green-400/5 group-hover:to-emerald-400/5 rounded-xl transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <h3 className="font-semibold text-lg text-secondary">
              {language === 'en' ? 'Enterprise Security & Compliance' : 'Kurumsal Güvenlik ve Uyumluluk'}
            </h3>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-2">
              {language === 'en' 
                ? 'Dedicated, secure environment; your data, your keys, your control — Dynamic AI workflow automation under your complete control and ownership.'
                : 'Adanmış, güvenli ortam; verileriniz, anahtarlarınız, kontrolünüz — Dinamik yapay zeka ile iş akışı otomatikleştirmeniz tam denetininiz ve sahipliğiniz altında.'}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
