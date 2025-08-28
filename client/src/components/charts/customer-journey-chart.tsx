import React, { useState } from 'react';
import { usePresentationContext } from '@/contexts/presentation-context';
import { Card } from '@/components/ui/card';
import { ChartEditor } from '@/components/creator/chart-editor';
import { ChartDataPoint } from '@/lib/chartUtils';
import { ArrowRight, Clock, CheckCircle, TrendingUp, Users, DollarSign } from 'lucide-react';

export function CustomerJourneyChart() {
  const { language, creatorMode } = usePresentationContext();
  
  const [journeyData, setJourneyData] = useState<ChartDataPoint[]>([
    { 
      stage: 'Keşif', 
      duration: '2-4 hafta', 
      activities: 'Pazar araştırması, problem tanımlama',
      value: 0,
      description: 'Müşteri iş akışındaki verimsizliklerin farkına varır'
    },
    { 
      stage: 'Pilot', 
      duration: '4-8 hafta', 
      activities: 'Deneme kurulumu, testler',
      value: 15,
      description: 'Sınırlı kapsamda başlangıç dağıtımı'
    },
    { 
      stage: 'Canlıya Geçiş', 
      duration: '8-12 hafta', 
      activities: 'Tam kurulum, kullanıcı eğitimleri',
      value: 40,
      description: 'Platformun departmanlar genelinde devreye alınması'
    },
    { 
      stage: 'Büyütme', 
      duration: '3-6 ay', 
      activities: 'Yaygınlaştırma, optimizasyon',
      value: 70,
      description: 'Platformun ilgili tüm iş birimlerine genişletilmesi'
    },
    { 
      stage: 'ROI Gerçekleşmesi', 
      duration: '6-12 ay', 
      activities: 'Tam otomasyon, ileri özellikler',
      value: 100,
      description: 'Tam iş akışı dönüşümü ve ölçülebilir ROI'
    }
  ]);

  // Başlık (TR)
  const [chartTitle, setChartTitle] = useState('Müşteri Yolculuğu ve Değer Gerçekleştirme');

  const handleSaveChart = (newData: ChartDataPoint[], newTitle?: string) => {
    setJourneyData(newData);
    if (newTitle) setChartTitle(newTitle);
  };

  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'discovery': return <Users className="w-6 h-6" />;
      case 'pilot': return <Clock className="w-6 h-6" />;
      case 'go-live': return <CheckCircle className="w-6 h-6" />;
      case 'scale': return <TrendingUp className="w-6 h-6" />;
      case 'roi realization': return <DollarSign className="w-6 h-6" />;
      default: return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getStageColor = (index: number) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600', 
      'from-purple-400 to-purple-600',
      'from-orange-400 to-orange-600',
      'from-emerald-400 to-emerald-600'
    ];
    return colors[index] || 'from-gray-400 to-gray-600';
  };

  return (
    <Card className="bg-white rounded-xl p-8 shadow-lg relative">
      {creatorMode && (
        <ChartEditor
          chartType="journey"
          title={chartTitle}
          data={journeyData}
          onSave={handleSaveChart}
          className="absolute top-2 right-2 z-10"
        />
      )}
      
      <h3 className="text-2xl font-bold text-secondary mb-8 text-center">
        {language === 'en' ? 'Müşteri Yolculuğu ve Değer Gerçekleştirme Zaman Çizelgesi' : 'Müşteri Yolculuğu ve Değer Gerçekleştirme Zaman Çizelgesi'}
      </h3>
      
      {/* Timeline Visualization */}
      <div className="relative">
        {journeyData.map((stage, index) => (
          <div key={index} className="flex items-center mb-8 last:mb-0">
            {/* Timeline Connector */}
            <div className="flex flex-col items-center mr-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${getStageColor(index)} rounded-full flex items-center justify-center text-white shadow-lg`}>
                {getStageIcon(stage.stage as string)}
              </div>
              {index < journeyData.length - 1 && (
                <div className="w-1 h-12 bg-gray-300 mt-4"></div>
              )}
            </div>
            
            {/* Stage Content */}
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-secondary mb-1">{stage.stage as string}</h4>
                    <p className="text-sm text-gray-600 font-medium">{stage.duration as string}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">{stage.value as number}%</div>
                    <div className="text-xs text-gray-500">
                      {language === 'en' ? 'Gerçekleşen Değer' : 'Gerçekleşen Değer'}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{stage.description as string}</p>
                <p className="text-sm text-gray-600">
                  <strong>{language === 'en' ? 'Ana Faaliyetler:' : 'Ana Faaliyetler:'}</strong> {stage.activities as string}
                </p>
              </div>
            </div>
            
            {/* Arrow Connector */}
            {index < journeyData.length - 1 && (
              <div className="ml-4 text-gray-400">
                <ArrowRight className="w-6 h-6" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* ROI Metrics Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border-2 border-emerald-200">
        <h4 className="text-lg font-semibold text-secondary mb-4 text-center">
          {language === 'en' ? 'Beklenen Müşteri ROI Zaman Çizelgesi' : 'Beklenen Müşteri ROI Zaman Çizelgesi'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">12</div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Başabaş Noktası (Ay)' : 'Başabaş Noktası (Ay)'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">%70+</div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Süreç Zamanı Azalması' : 'Süreç Zamanı Azalması'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">%60+</div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Manuel Müdahale Azalması' : 'Manuel Müdahale Azalması'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
