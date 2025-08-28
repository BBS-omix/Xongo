import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { UnitEconomicsChart } from '@/components/charts/unit-economics-chart';
import { TurkishTreemap } from '@/components/charts/turkish-treemap';

export function UnitEconomics() {
  const { language, creatorMode } = usePresentationContext();
  const { unitEconomics } = presentationData;
  
  // State for editable content
  const [unitTitle, setUnitTitle] = useState(unitEconomics.title);
  const [unitSegments, setUnitSegments] = useState(unitEconomics.segments);

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Editor */}
        {creatorMode && (
          <ContentEditor
            title="Unit Economics Title"
            data={[{ id: 'unit_title', content: unitTitle }]}
            onSave={(newData) => setUnitTitle(newData[0].content)}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[
              { key: 'content', label: 'Title', type: 'text', multilingual: true }
            ]}
          />
        )}
        
        <h2 className="font-poppins font-bold text-3xl text-center text-secondary mb-12">
          {unitTitle[language]}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Chart */}
          <Card className="bg-white rounded-xl p-6 shadow-lg">
            <UnitEconomicsChart />
          </Card>
          
          {/* Metrics */}
          <div className="space-y-6 relative">
            {/* Segments Editor */}
            {creatorMode && (
              <ContentEditor
                title="Customer Segments"
                data={unitSegments}
                onSave={setUnitSegments}
                className="absolute top-0 right-0 z-10"
                type="cards"
                fields={[
                  { key: 'name', label: 'Segment Name', type: 'text', multilingual: true },
                  { key: 'subtitle', label: 'Subtitle', type: 'text', multilingual: true },
                  { key: 'acv', label: 'ACV Value', type: 'text', multilingual: false },
                  { key: 'detail', label: 'Detail', type: 'text', multilingual: true }
                ]}
              />
            )}
            
            <Card className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-secondary mb-4">
                {language === 'en' ? 'Customer Segments' : 'Müşteri Segmentleri'}
              </h4>
              <div className="space-y-4">
                {unitSegments.map((segment, index) => {
                  const colors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50'];
                  const textColors = ['text-primary', 'text-success', 'text-purple-600'];
                  
                  return (
                    <div key={index} className={`flex justify-between items-center p-3 ${colors[index]} rounded-lg`}>
                      <div>
                        <div className="font-medium">{segment.name[language]}</div>
                        <div className="text-sm text-gray-600">{segment.subtitle[language]}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${textColors[index]}`}>{segment.acv}</div>
                        <div className="text-xs text-gray-500">{segment.detail[language]}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
        
        {/* Turkish Treemap */}
        <div className="mt-12">
          <TurkishTreemap />
        </div>
      </div>
    </section>
  );
}
