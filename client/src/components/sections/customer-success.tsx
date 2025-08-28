import { usePresentationContext } from '@/contexts/presentation-context';
import { ContentEditor } from '@/components/creator/content-editor';
import { CustomerJourneyChart } from '@/components/charts/customer-journey-chart';
import { ROITimelineChart } from '@/components/charts/roi-timeline-chart';
import { useState } from 'react';

export function CustomerSuccess() {
  const { language, creatorMode } = usePresentationContext();
  
  // State for editable content
  const [sectionTitle, setSectionTitle] = useState({
    en: 'Customer Success & ROI Realization',
    tr: 'Müşteri Başarısı & ROI Gerçekleştirme'
  });
  const [sectionSubtitle, setSectionSubtitle] = useState({
    en: 'Our customers follow a proven journey to realize measurable ROI and operational efficiency gains',
    tr: 'Müşterilerimiz ölçülebilir ROI ve operasyonel verimlilik kazanımları elde etmek için kanıtlanmış bir yolculuk izler'
  });

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Content Editor */}
        {creatorMode && (
          <ContentEditor
            title="Customer Success Content"
            data={[{ 
              id: 'customer_success', 
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
          <h2 className="font-poppins font-bold text-3xl text-secondary mb-4">
            {sectionTitle[language]}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {sectionSubtitle[language]}
          </p>
        </div>

        <div className="space-y-12">
          {/* Customer Journey */}
          <CustomerJourneyChart />
          
          {/* ROI Timeline */}
          {/* <ROITimelineChart /> */}
        </div>
      </div>
    </section>
  );
}