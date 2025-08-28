import { usePresentationContext } from '@/contexts/presentation-context';
import { ContentEditor } from '@/components/creator/content-editor';
import { FinancialBreakdownTable } from '@/components/tables/financial-breakdown-table';
import { CustomerSegmentsTable } from '@/components/tables/customer-segments-table';
import { TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

export function ExcelTables() {
  const { language, complexity, creatorMode } = usePresentationContext();
  
  // State for editable content
  const [sectionTitle, setSectionTitle] = useState({
    en: 'Investor Data Tables',
    tr: 'Yatırımcı Veri Tabloları'
  });
  const [sectionSubtitle, setSectionSubtitle] = useState({
    en: 'Detailed financial projections and customer segment analysis with authentic business metrics',
    tr: 'Otantik işletme metrikleri ile detaylı mali projeksiyonlar ve müşteri segment analizi'
  });

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Content Editor */}
        {creatorMode && (
          <ContentEditor
            title="Excel Tables Content"
            data={[{ 
              id: 'excel_tables', 
              title: sectionTitle,
              subtitle: sectionSubtitle
            }]}
            onSave={(newData) => {
              setSectionTitle(newData[0].title);
              setSectionSubtitle(newData[0].subtitle);
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
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="font-poppins font-bold text-3xl text-secondary">
              {sectionTitle[language]}
            </h2>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {sectionSubtitle[language]}
          </p>
        </div>

        <div className="space-y-12">
          {/* Financial Breakdown Table */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary mb-1">
                  {language === 'en' ? 'Table 1: Financial Projections' : 'Tablo 1: Mali Projeksiyonlar'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {complexity === 'basic' 
                    ? (language === 'en' 
                      ? 'High-level financial overview and key metrics'
                      : 'Üst düzey mali genel bakış ve anahtar metrikler')
                    : (language === 'en' 
                      ? 'Month-by-month breakdown of revenue, expenses, and key business metrics'
                      : 'Gelir, gider ve temel işletme metriklerinin ay ay dökümü')
                  }
                </p>
              </div>
            </div>
            <FinancialBreakdownTable />
          </div>

          {/* Customer Segments Table - Only show in Advanced mode */}
          {complexity === 'advanced' && (
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary mb-1">
                    {language === 'en' ? 'Table 2: Customer Segment Strategy' : 'Tablo 2: Müşteri Segment Stratejisi'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === 'en' 
                      ? 'Target customer segments with sales cycles, pricing, and revenue projections'
                      : 'Satış döngüleri, fiyatlandırma ve gelir projeksiyonları ile hedef müşteri segmentleri'
                    }
                  </p>
                </div>
              </div>
              <CustomerSegmentsTable />
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className={`mt-12 grid grid-cols-1 ${complexity === 'basic' ? 'md:grid-cols-2' : 'md:grid-cols-4'} gap-6`}>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">$750K</div>
            <div className="text-sm text-gray-600">{language === 'en' ? 'Total Investment Expectations' : 'Toplam Yatırım Beklentisi'}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">$88K</div>
            <div className="text-sm text-gray-600">{language === 'en' ? 'Year 1 Revenue' : '1. Yıl Gelir'}</div>
          </div>
          {complexity === 'advanced' && (
            <>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center border-l-4 border-purple-500">
                <div className="text-2xl font-bold text-purple-600">$2.23M</div>
                <div className="text-sm text-gray-600">{language === 'en' ? 'Year 2 Revenue' : '2. Yıl Gelir'}</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center border-l-4 border-orange-500">
                <div className="text-2xl font-bold text-orange-600">10%</div>
                <div className="text-sm text-gray-600">{language === 'en' ? 'Share' : 'Hisse Karşılığı'}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}