import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { 
  DollarSign, 
  ShieldCheck, 
  ArrowRightCircle, 
  Computer, 
  Handshake, 
  FileText, 
  Headphones, 
  Megaphone, 
  AlertTriangle 
} from 'lucide-react';

export function Achievements() {
  const { language, creatorMode } = usePresentationContext();
  const { achievements } = presentationData;
  
  // State for editable content
  const [achievementTitle, setAchievementTitle] = useState(achievements.title);
  const [next12MonthsItems, setNext12MonthsItems] = useState(achievements.next12Months.items);
  const [next12to24MonthsItems, setNext12to24MonthsItems] = useState(achievements.next12to24Months.items);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dollar-sign': return <DollarSign className="w-6 h-6" />;
      case 'shield-check': return <ShieldCheck className="w-6 h-6" />;
      case 'arrow-right-circle': return <ArrowRightCircle className="w-6 h-6" />;
      case 'computer': return <Computer className="w-6 h-6" />;
      case 'handshake': return <Handshake className="w-6 h-6" />;
      case 'file-text': return <FileText className="w-6 h-6" />;
      case 'headphones': return <Headphones className="w-6 h-6" />;
      case 'megaphone': return <Megaphone className="w-6 h-6" />;
      case 'alert-triangle': return <AlertTriangle className="w-6 h-6" />;
      default: return <DollarSign className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Editor */}
        {creatorMode && (
          <ContentEditor
            title="Achievement Title"
            data={[{ id: 'achievement_title', content: achievementTitle }]}
            onSave={(newData) => setAchievementTitle(newData[0].content)}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[
              { key: 'content', label: 'Title', type: 'text', multilingual: true }
            ]}
            sectionKey="achievement_title"
          />
        )}
        
        <h2 className="font-poppins font-bold text-3xl text-center text-secondary mb-12">
          {achievementTitle[language]}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Next 12 Months */}
          <div className="relative">
            {/* 12 Months Items Editor */}
            {creatorMode && (
              <ContentEditor
                title="Next 12 Months"
                data={next12MonthsItems}
                onSave={setNext12MonthsItems}
                className="absolute top-0 right-0 z-10"
                type="cards"
                fields={[
                  { key: 'title', label: 'Title', type: 'text', multilingual: true },
                  { key: 'subtitle', label: 'Subtitle', type: 'textarea', multilingual: true },
                  { key: 'icon', label: 'Icon Name', type: 'text', multilingual: false }
                ]}
                sectionKey="achievement_next_12_months"
              />
            )}
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-xl text-secondary mb-6 text-center">
                {achievements.next12Months.title[language]}
              </h3>
              <div className="space-y-4">
                {next12MonthsItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white bg-opacity-70 rounded-lg">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-white">
                        {getIcon(item.icon)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary text-sm">
                        {item.title[language]}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.subtitle[language]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
            </Card>
          </div>

          {/* Next 12-24 Months */}
          <div className="relative">
            {/* 12-24 Months Items Editor */}
            {creatorMode && (
              <ContentEditor
                title="Next 12-24 Months"
                data={next12to24MonthsItems}
                onSave={setNext12to24MonthsItems}
                className="absolute top-0 right-0 z-10"
                type="cards"
                fields={[
                  { key: 'title', label: 'Title', type: 'text', multilingual: true },
                  { key: 'subtitle', label: 'Subtitle', type: 'textarea', multilingual: true },
                  { key: 'icon', label: 'Icon Name', type: 'text', multilingual: false }
                ]}
                sectionKey="achievement_next_12_to_24_months"
              />
            )}
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-xl text-secondary mb-6 text-center">
                {achievements.next12to24Months.title[language]}
              </h3>
              <div className="space-y-4">
                {next12to24MonthsItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white bg-opacity-70 rounded-lg">
                    <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-white">
                        {getIcon(item.icon)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary text-sm">
                        {item.title[language]}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.subtitle[language]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Value Proposition */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-8">
          <div className="text-center">
            <h3 className="font-semibold text-2xl text-secondary mb-4">
              {language === 'en' ? 'Our Impact' : 'Etkimiz'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">%60+</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Fewer Manual Touches' : 'Daha Az Manuel Temas'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">%70+</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Shorter Cycle Time' : 'Daha Kısa Çevrim Süresi'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">%98.5</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Full Audit Trail' : 'Tam Denetim İzi'}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}