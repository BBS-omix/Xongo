import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { FileText, Video, Workflow, Cpu, Database, BarChart3 } from 'lucide-react';

export function UsageMetrics() {
  const { language, creatorMode } = usePresentationContext();
  const { usageMetrics } = presentationData;
  
  // State for editable content
  const [metricsTitle, setMetricsTitle] = useState(usageMetrics.title);
  const [metricsSubtitle, setMetricsSubtitle] = useState(usageMetrics.subtitle);
  const [metricsList, setMetricsList] = useState(usageMetrics.metrics);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'file-text': return <FileText className="w-8 h-8" />;
      case 'video': return <Video className="w-8 h-8" />;
      case 'workflow': return <Workflow className="w-8 h-8" />;
      case 'cpu': return <Cpu className="w-8 h-8" />;
      case 'database': return <Database className="w-8 h-8" />;
      default: return <BarChart3 className="w-8 h-8" />;
    }
  };

  const iconColors = [
    'text-blue-600 bg-blue-100',
    'text-green-600 bg-green-100',
    'text-purple-600 bg-purple-100',
    'text-amber-600 bg-amber-100',
    'text-indigo-600 bg-indigo-100'
  ];

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Content Editor */}
        {creatorMode && (
          <ContentEditor
            title="Usage Metrics Content"
            data={[{ 
              id: 'usage_metrics', 
              title: metricsTitle,
              subtitle: metricsSubtitle
            }]}
            onSave={(newData) => {
              setMetricsTitle(newData[0].title);
              setMetricsSubtitle(newData[0].subtitle);
            }}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[
              { key: 'title', label: 'Section Title', type: 'text', multilingual: true },
              { key: 'subtitle', label: 'Section Subtitle', type: 'textarea', multilingual: true }
            ]}
          />
        )}
        
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl text-secondary mb-4">
            {metricsTitle[language]}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {metricsSubtitle[language]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 relative">
          {/* Metrics Editor */}
          {creatorMode && (
            <ContentEditor
              title="Usage Metrics"
              data={metricsList}
              onSave={setMetricsList}
              className="absolute top-0 right-0 z-10"
              type="cards"
              fields={[
                { key: 'name', label: 'Metric Name', type: 'text', multilingual: true },
                { key: 'unit', label: 'Unit', type: 'text', multilingual: true },
                { key: 'icon', label: 'Icon Name', type: 'text', multilingual: false }
              ]}
            />
          )}
          
          {metricsList.map((metric, index) => (
            <Card key={index} className="card-hover bg-white rounded-xl p-6 text-center shadow-lg border-2 border-gray-100">
              <div className={`w-16 h-16 ${iconColors[index]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {getIcon(metric.icon)}
              </div>
              <h4 className="font-semibold text-lg text-secondary mb-2">
                {metric.name[language]}
              </h4>
              <p className="text-sm text-gray-600">
                {metric.unit[language]}
              </p>
            </Card>
          ))}
        </div>

        {/* Revenue Model Explanation */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8">
          <div className="text-center">
            <h3 className="font-semibold text-xl text-secondary mb-4">
              {language === 'en' ? 'Revenue Model' : 'Gelir Modeli'}
            </h3>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-left">
                  <h4 className="font-semibold text-secondary mb-2">
                    {language === 'en' ? 'Base Subscription' : 'Temel Abonelik'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? 'Monthly platform fee covers core connectors, basic agent quota, and standard features'
                      : 'Aylık platform ücreti temel bağlayıcıları, temel ajan kotasını ve standart özellikleri kapsar'
                    }
                  </p>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-secondary mb-2">
                    {language === 'en' ? 'Usage-Based Billing' : 'Kullanım Bazlı Faturalandırma'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? 'Pay for what you actually use - documents processed, LLM tokens, storage, and compute time'
                      : 'Gerçekte kullandığınız kadar ödeyin - işlenen belgeler, LLM tokenları, depolama ve işlem süresi'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}