import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { FundsChart } from '@/components/charts/funds-chart';

export function FinancialProjections() {
  const { language, complexity, creatorMode } = usePresentationContext();
  const { financial } = presentationData;
  
  // State for editable content
  const [financialTitle, setFinancialTitle] = useState(financial.title);
  const [financialKpis, setFinancialKpis] = useState(financial.kpis);

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Editor */}
        {creatorMode && (
          <ContentEditor
            title="Financial Projections Title"
            data={[{ id: 'financial_title', content: financialTitle }]}
            onSave={(newData) => setFinancialTitle(newData[0].content)}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[
              { key: 'content', label: 'Title', type: 'text', multilingual: true }
            ]}
            sectionKey="financial_projections_title"
          />
        )}
        
        <h2 className="font-poppins font-bold text-3xl text-center text-secondary mb-12">
          {financialTitle[language]}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Revenue Chart */}
          <Card className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="font-semibold text-secondary mb-4">
              {language === 'en' ? 'Revenue & Burn Rate' : 'Gelir ve Yakma Oranı'}
            </h4>
            <RevenueChart />
          </Card>
          
          {/* Use of Funds */}
          <Card className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="font-semibold text-secondary mb-4">
              {language === 'en' ? 'Use of Funds ($675K)' : 'Fonların Kullanımı ($675K)'}
            </h4>
            <FundsChart />
          </Card>
        </div>
        
        {/* KPIs */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* KPIs Editor */}
          {creatorMode && (
            <ContentEditor
              title="Financial KPIs"
              data={financialKpis}
              onSave={setFinancialKpis}
              className="absolute top-0 right-0 z-10"
              type="cards"
              fields={[
                { key: 'value', label: 'Value', type: 'text', multilingual: false },
                { key: 'label', label: 'Label', type: 'text', multilingual: true }
              ]}
              sectionKey="financial_projections_kpis"
            />
          )}
          
          {financialKpis.slice(0, complexity === 'basic' ? 2 : 4).map((kpi, index) => {
            const colors = ['text-primary', 'text-success', 'text-accent', 'text-purple-600'];
            return (
              <Card key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className={`text-2xl font-bold ${colors[index]} mb-2`}>{kpi.value}</div>
                <div className="text-sm text-gray-600">{kpi.label[language]}</div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
