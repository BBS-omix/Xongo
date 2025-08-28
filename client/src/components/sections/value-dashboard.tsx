import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { ArrowUpRight, Target, Users, Globe, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';

export function ValueDashboard() {
  const { language, creatorMode } = usePresentationContext();
  
  // State for editable content
  const [dashboardTitle, setDashboardTitle] = useState({
    en: 'Investment Opportunity Dashboard',
    tr: 'Yatırım Fırsatı Paneli'
  });
  const [dashboardSubtitle, setDashboardSubtitle] = useState({
    en: 'Transforming enterprise workflows with autonomous AI agents',
    tr: 'Otonom AI ajanları ile kurumsal iş akışlarını dönüştürme'
  });

  const dashboardMetrics = [
    {
      icon: <Target className="w-8 h-8" />,
      value: "$750K",
      label: { en: "Seed Funding Target", tr: "Tohum Fon Hedefi" },
      subtitle: { en: "12 month runway", tr: "12 aylık işletme maliyeti" },
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "~$2.23M",
      label: { en: "Target ARR (Year 2)", tr: "Hedef ARR (2. Yıl)" },
      subtitle: { en: "Convert pilots to revenue", tr: "Pilotları gelire dönüştür" },
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: "~$1.9T+",
      label: { en: "Target Market by 2030", tr: "Hedef Pazarı 2030" },
      subtitle: { en: "2024: ~$300B+", tr: "2024: ~$300B+" },
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: "10%",
      label: { en: "Share", tr: "Yatırım Karşılığı Hisse" },
      subtitle: { en: "", tr: "" },
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600"
    }
  ];

const impactMetrics = [
  {
    value: "2025 Eylül",
    label: {
      en: "Investment start",
      tr: "Yatırım başlangıcı"
    },
    color: "text-gray-500"
  },
  {
    value: "2026 Kasım",
    label: {
      en: "Monthly breakeven (revenue ≥ expenses)",
      tr: "Aylık başabaş (gelir ≥ gider)"
    },
    color: "text-green-600"
  },
  {
    value: "2027 Nisan",
    label: {
      en: "Investment payback / cumulative breakeven",
      tr: "Yatırım geri kazanımı / kümülatif başabaş"
    },
    color: "text-orange-500"
  }
  
];


  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Content Editor */}
        {creatorMode && (
          <ContentEditor
            title="Dashboard Content"
            data={[{ 
              id: 'dashboard_content', 
              title: dashboardTitle,
              subtitle: dashboardSubtitle
            }]}
            onSave={(newData) => {
              setDashboardTitle(newData[0].title);
              setDashboardSubtitle(newData[0].subtitle);
            }}
            className="absolute top-4 right-4 z-20"
            type="text"
            fields={[
              { key: 'title', label: 'Dashboard Title', type: 'text', multilingual: true },
              { key: 'subtitle', label: 'Dashboard Subtitle', type: 'textarea', multilingual: true }
            ]}
            sectionKey="value_dashboard_content"
          />
        )}
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold text-4xl text-secondary mb-4">
            {dashboardTitle[language]}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {dashboardSubtitle[language]}
          </p>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardMetrics.map((metric, index) => (
            <Card key={index} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="p-6 relative z-10">
                <div className={`w-12 h-12 ${metric.textColor} bg-current bg-opacity-10 rounded-2xl flex items-center justify-center mb-4`}>
                  <div className="text-current">
                    {metric.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">{metric.value}</div>
                <h4 className="font-semibold text-secondary mb-1">{metric.label[language]}</h4>
                <p className="text-sm text-gray-600">{metric.subtitle[language]}</p>
                <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-gray-400 group-hover:text-current transition-colors" />
              </div>
            </Card>
          ))}
        </div>

        {/* Impact Metrics */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="font-poppins font-bold text-2xl text-secondary mb-2">
              {language === 'en' ? 'Growth & Return Overview' : 'Büyüme ve Getiri Özeti'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Revenue, expense, and investment milestones' 
                : 'Gelir, gider ve yatırım odaklı kilometre taşları'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactMetrics.map((impact, index) => (
              <div key={index} className="text-center group">
                <div className={`text-5xl font-bold ${impact.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {impact.value}
                </div>
                <div className="text-sm font-medium text-secondary">
                  {impact.label[language]}
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </section>
  );
}