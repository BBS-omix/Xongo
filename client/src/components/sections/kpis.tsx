import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { TestTube, Zap, ShieldCheck, Clock, TrendingUp, RefreshCw } from 'lucide-react';

export function KPIs() {
  const { language, creatorMode } = usePresentationContext();
  const { kpis } = presentationData;
  
  // State for editable content
  const [kpiTitle, setKpiTitle] = useState(kpis.title);
  const [kpiMetrics, setKpiMetrics] = useState(kpis.metrics);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'flask': return <TestTube className="w-8 h-8" />;
      case 'zap': return <Zap className="w-8 h-8" />;
      case 'shield-check': return <ShieldCheck className="w-8 h-8" />;
      case 'clock': return <Clock className="w-8 h-8" />;
      case 'trending-up': return <TrendingUp className="w-8 h-8" />;
      case 'refresh-cw': return <RefreshCw className="w-8 h-8" />;
      default: return <TrendingUp className="w-8 h-8" />;
    }
  };

  const iconColors = [
    'text-blue-600 bg-blue-100',
    'text-amber-600 bg-amber-100', 
    'text-green-600 bg-green-100',
    'text-purple-600 bg-purple-100',
    'text-indigo-600 bg-indigo-100',
    'text-emerald-600 bg-emerald-100'
  ];

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* KPI Title Editor */}
        {creatorMode && (
          <ContentEditor
            title="KPI Title"
            data={[{ id: 'kpi_title', content: kpiTitle }]}
            onSave={(newData) => setKpiTitle(newData[0].content)}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[
              { key: 'content', label: 'KPI Title', type: 'text', multilingual: true }
            ]}
            sectionKey="kpi_title"
          />
        )}
        
        <div className="text-center mb-12 relative">
          <h2 className="font-poppins font-bold text-3xl text-secondary mb-4">
            {kpiTitle[language]}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {kpis.subtitle[language]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* KPI Metrics Editor */}
          {creatorMode && (
            <ContentEditor
              title="KPI Metrics"
              data={kpiMetrics}
              onSave={setKpiMetrics}
              className="absolute top-0 right-0 z-10"
              type="cards"
              fields={[
                { key: 'title', label: 'Metric Title', type: 'text', multilingual: true },
                { key: 'value', label: 'Metric Value', type: 'text', multilingual: false },
                { key: 'description', label: 'Description', type: 'textarea', multilingual: true },
                { key: 'icon', label: 'Icon Name', type: 'text', multilingual: false }
              ]}
              sectionKey="kpi_metrics"
            />
          )}
          {kpiMetrics.map((metric, index) => (
            <Card key={index} className="card-hover bg-white rounded-xl p-6 text-center shadow-lg">
              <div className={`w-16 h-16 ${iconColors[index]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {getIcon(metric.icon)}
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">
                {metric.value}
              </div>
              <h4 className="font-semibold text-secondary mb-2">
                {metric.title[language]}
              </h4>
              <p className="text-sm text-gray-600">
                {metric.description[language]}
              </p>
            </Card>
          ))}
        </div>

        {/* Performance Targets */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8">
          <div className="text-center">
            <h3 className="font-semibold text-xl text-secondary mb-6">
              {language === 'en' ? 'Key Performance Targets' : 'Temel Performans Hedefleri'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white bg-opacity-70 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">≥75%</div>
                <div className="text-sm font-medium text-secondary">
                  {language === 'en' ? 'Pilot Success Rate' : 'Pilot Başarı Oranı'}
                </div>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-70 rounded-lg">
                <div className="text-2xl font-bold text-success mb-1">≤6M</div>
                <div className="text-sm font-medium text-secondary">
                  {language === 'en' ? 'Time to Value' : 'Değer Süresi'}
                </div>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-70 rounded-lg">
                <div className="text-2xl font-bold text-accent mb-1">≥70%</div>
                <div className="text-sm font-medium text-secondary">
                  {language === 'en' ? 'Gross Margin' : 'Brüt Marj'}
                </div>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-70 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">≥120%</div>
                <div className="text-sm font-medium text-secondary">
                  {language === 'en' ? 'Net Revenue Retention' : 'Net Gelir Tutma'}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}