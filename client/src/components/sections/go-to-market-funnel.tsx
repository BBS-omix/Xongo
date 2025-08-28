import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { TestTube, Rocket, Handshake, Clock, Zap, CheckCircle } from 'lucide-react';

export function GoToMarketFunnel() {
  const { language, creatorMode } = usePresentationContext();
  const { goToMarket } = presentationData;
  
  // State for editable content
  const [marketTitle, setMarketTitle] = useState(goToMarket.title);
  const [marketSubtitle, setMarketSubtitle] = useState(goToMarket.subtitle);
  const [marketFunnel, setMarketFunnel] = useState(goToMarket.funnel);
  const [marketKpis, setMarketKpis] = useState(goToMarket.kpis);

  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'pilots':
      case 'pilotlar':
        return <TestTube className="w-8 h-8" />;
      case 'go-lives':
      case 'canlıya geçiş':
        return <Rocket className="w-8 h-8" />;
      case 'paid logos':
      case 'ücretli logolar':
        return <Handshake className="w-8 h-8" />;
      default:
        return <TestTube className="w-8 h-8" />;
    }
  };

  const getStageColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500'];
    return colors[index] || 'bg-gray-500';
  };

  const getStageTextColor = (index: number) => {
    const colors = ['text-blue-600', 'text-emerald-600', 'text-purple-600'];
    return colors[index] || 'text-gray-600';
  };

  const getStageGradient = (index: number) => {
    const gradients = [
      'from-blue-100 to-blue-200 border-blue-300',
      'from-emerald-100 to-emerald-200 border-emerald-300',
      'from-purple-100 to-purple-200 border-purple-300'
    ];
    return gradients[index] || 'from-gray-100 to-gray-200 border-gray-300';
  };

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Content Editors */}
        {creatorMode && (
          <>
            <ContentEditor
              title="Go-to-Market Title"
              data={[{ id: 'market_title', title: marketTitle, subtitle: marketSubtitle }]}
              onSave={(newData) => {
                setMarketTitle(newData[0].title);
                setMarketSubtitle(newData[0].subtitle);
              }}
              className="absolute top-4 right-4 z-10"
              type="text"
              fields={[
                { key: 'title', label: 'Title', type: 'text', multilingual: true },
                { key: 'subtitle', label: 'Subtitle', type: 'textarea', multilingual: true }
              ]}
            />
            <ContentEditor
              title="Funnel Stages"
              data={marketFunnel}
              onSave={setMarketFunnel}
              className="absolute top-4 left-4 z-10"
              type="cards"
              fields={[
                { key: 'stage', label: 'Stage Name', type: 'text', multilingual: true },
                { key: 'value', label: 'Value', type: 'number', multilingual: false },
                { key: 'conversionRate', label: 'Conversion Rate %', type: 'number', multilingual: false },
                { key: 'timeframe', label: 'Timeframe', type: 'text', multilingual: true }
              ]}
            />
          </>
        )}
        
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl text-secondary mb-4">
            {marketTitle[language]}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {marketSubtitle[language]}
          </p>
        </div>

        {/* Funnel Visualization */}
        <div className="relative mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8">
            {marketFunnel.map((stage, index) => (
              <div key={index} className="relative flex flex-col items-center">
                {/* Connector Arrow */}
                {index < marketFunnel.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 z-10">
                    <div className="flex items-center">
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      <div className="w-3 h-3 border-t-2 border-r-2 border-gray-300 transform rotate-45 -ml-2"></div>
                    </div>
                    {stage.conversionRate && (
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-600 border">
                        {stage.conversionRate}%
                      </div>
                    )}
                  </div>
                )}

                <Card className={`bg-gradient-to-br ${getStageGradient(index)} border-2 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[280px]`}>
                  <div className={`w-16 h-16 ${getStageColor(index)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <div className="text-white">
                      {getStageIcon(stage.stage[language])}
                    </div>
                  </div>
                  <h3 className="font-bold text-2xl text-secondary mb-2">
                    {stage.stage[language]}
                  </h3>
                  <div className="text-4xl font-bold mb-2" style={{ color: getStageColor(index).replace('bg-', '#').replace('500', '') }}>
                    {stage.count}
                  </div>
                  <p className="text-sm text-gray-600">
                    {stage.description[language]}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative">
          {/* KPIs Editor */}
          {creatorMode && (
            <ContentEditor
              title="Go-to-Market KPIs"
              data={marketKpis}
              onSave={setMarketKpis}
              className="absolute top-0 right-0 z-10"
              type="cards"
              fields={[
                { key: 'metric', label: 'Metric', type: 'text', multilingual: true },
                { key: 'value', label: 'Value', type: 'text', multilingual: true }
              ]}
            />
          )}
          
          {marketKpis.map((kpi, index) => (
            <Card key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} rounded-lg flex items-center justify-center`}>
                  {index === 0 ? <Zap className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-semibold text-secondary">
                    {kpi.metric[language]}
                  </h4>
                  <p className="text-lg font-bold text-primary">
                    {kpi.value[language]}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        {/* <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8">
          <div className="text-center">
            <h3 className="font-bold text-xl text-secondary mb-6">
              {language === 'en' ? 'Year 1 Target Summary' : '1. Yıl Hedef Özeti'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary">18-24</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Weeks pilot length' : 'Hafta pilot süresi'}
                </div>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary">6</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Months to first value' : 'İlk değere ay'}
                </div>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary">≥90%</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Accuracy target' : 'Doğruluk hedefi'}
                </div>
              </div>
            </div>
            <p className="text-gray-600 mt-6 text-sm">
              {language === 'en' 
                ? 'Numbers reflect current plan; conversions are targets.'
                : 'Sayılar mevcut planı yansıtır; dönüştürmeler hedeflerdir.'
              }
            </p>
          </div>
        </Card> */}
      </div>
    </section>
  );
}