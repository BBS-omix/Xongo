import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { MarketChart } from '@/components/charts/market-chart';
import { useState } from 'react';

export function MarketOpportunity() {
  const { language, creatorMode } = usePresentationContext();
  const { marketOpportunity } = presentationData;
  
  // State for editable content
  const [marketTitle, setMarketTitle] = useState(marketOpportunity.title);
  const [marketSegments, setMarketSegments] = useState(marketOpportunity.segments);

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Market Title Editor */}
        {creatorMode && (
          <ContentEditor
            title="Market Title"
            data={[{ id: 'market_title', content: marketTitle }]}
            onSave={(newData) => setMarketTitle(newData[0].content)}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[
              { key: 'content', label: 'Market Title', type: 'text', multilingual: true }
            ]}
          />
        )}
        
        <h2 className="font-poppins font-bold text-3xl text-center text-secondary mb-12">
          {marketTitle[language]}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Chart Container */}
          <Card className="bg-gray-50 rounded-xl p-6">
            <MarketChart />
          </Card>
          
          {/* Market Segments */}
          <div className="space-y-4 relative">
            {/* Market Segments Editor */}
            {creatorMode && (
              <ContentEditor
                title="Market Segments"
                data={marketSegments}
                onSave={setMarketSegments}
                className="absolute top-0 right-0 z-10"
                type="cards"
                fields={[
                  { key: 'name', label: 'Segment Name', type: 'text', multilingual: true },
                  { key: 'base', label: 'Base Value (2024)', type: 'text', multilingual: false },
                  { key: 'future', label: 'Future Value (2030)', type: 'text', multilingual: false },
                  { key: 'cagr', label: 'CAGR %', type: 'text', multilingual: false }
                ]}
              />
            )}
            {marketSegments.map((segment, index) => {
              const colors = [
                'from-blue-50 to-blue-100 border-primary',
                'from-green-50 to-green-100 border-success',
                'from-amber-50 to-amber-100 border-accent'
              ];
              const textColors = ['text-primary', 'text-success', 'text-accent'];
              
              return (
                <div key={index} className={`bg-gradient-to-r ${colors[index]} rounded-lg p-4 border-l-4`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-secondary">{segment.name[language]}</h4>
                      <p className="text-sm text-gray-600">2024: ${segment.base}B → 2030: ${segment.future}B</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${textColors[index]}`}>CAGR {segment.cagr}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
