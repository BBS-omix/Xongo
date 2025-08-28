import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function BusinessModel() {
  const { language, creatorMode } = usePresentationContext();
  const { pricingTiers } = presentationData;
  
  // State for editable content
  const [tiers, setTiers] = useState(pricingTiers);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          gradient: 'from-blue-50 to-blue-100',
          border: 'border-blue-200',
          button: 'bg-primary hover:bg-blue-700',
          icon: 'bg-primary'
        };
      case 'purple':
        return {
          gradient: 'from-purple-50 to-purple-100',
          border: 'border-purple-200',
          button: 'bg-purple-600 hover:bg-purple-700',
          icon: 'bg-purple-600'
        };
      case 'secondary':
        return {
          gradient: 'from-gray-50 to-gray-100',
          border: 'border-gray-200',
          button: 'bg-secondary hover:bg-gray-700',
          icon: 'bg-secondary'
        };
      default:
        return {
          gradient: 'from-gray-50 to-gray-100',
          border: 'border-gray-200',
          button: 'bg-gray-600 hover:bg-gray-700',
          icon: 'bg-gray-600'
        };
    }
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Pricing Tiers Editor */}
        {creatorMode && (
          <ContentEditor
            title="Pricing Tiers"
            data={tiers}
            onSave={setTiers}
            className="absolute top-4 right-4 z-10"
            type="cards"
            fields={[
              { key: 'name', label: 'Tier Name', type: 'text', multilingual: true },
              { key: 'price', label: 'Price', type: 'text', multilingual: true },
              { key: 'description', label: 'Description', type: 'textarea', multilingual: true },
              { key: 'features', label: 'Features (comma-separated)', type: 'textarea', multilingual: true }
            ]}
            sectionKey="business_model_pricing_tiers"
          />
        )}
        
        <h2 className="font-poppins font-bold text-3xl text-center text-secondary mb-12">
          {language === 'en' ? 'Business Model & Pricing' : 'İş Modeli ve Fiyatlandırma'}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier, index) => {
            const colors = getColorClasses(tier.color);
            return (
              <Card 
                key={index} 
                className={`card-hover bg-gradient-to-br ${colors.gradient} rounded-xl p-8 border ${colors.border} ${tier.popular ? 'relative' : ''}`}
              >
               
                <div className="text-center mb-6">
                  <h3 className="font-poppins font-bold text-2xl text-secondary mb-2">
                    {tier.name[language]}
                  </h3>
                  <div className="text-4xl font-bold text-secondary mb-2">{tier.price}</div>
                  <p className="text-sm text-gray-600">{tier.period[language]}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className={`w-5 h-5 ${colors.icon} rounded-full flex items-center justify-center`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">{feature[language]}</span>
                    </li>
                  ))}
                </ul>
                
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
