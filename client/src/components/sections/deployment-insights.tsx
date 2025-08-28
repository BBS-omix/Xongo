import { usePresentationContext } from '@/contexts/presentation-context';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState } from 'react';
import { Cloud, Server, Shield } from 'lucide-react';

export function DeploymentInsights() {
  const { language, creatorMode } = usePresentationContext();
  
  // State for editable content
  const [deploymentTitle, setDeploymentTitle] = useState({
    en: 'Deployment Mix — Year 1',
    tr: 'Müşteri Hosting Tercihi Beklentileri — 1. Yıl'
  });

  const deploymentData = [
    {
      name: language === 'en' ? 'Cloud (Shared or Dedicated)' : 'Bulut (Paylaşılan veya Adanmış)',
      value: 65,
      color: '#3b82f6',
      features: [
        { en: 'Fast start', tr: 'Hızlı başlangıç' },
        { en: 'Tenant isolation', tr: 'Kiracı izolasyonu' },
        { en: 'VPC/Dedicated optional', tr: 'VPC/Adanmış opsiyonel' }
      ]
    },
    {
      name: language === 'en' ? 'On-Prem/Private Cloud' : 'Yerinde/Özel Bulut',
      value: 35,
      color: '#8b5cf6',
      features: [
        { en: 'Customer hardware/region', tr: 'Müşteri donanımı/bölgesi' },
        { en: 'Data residency control', tr: 'Veri yerleşimi kontrolü' }
      ]
    }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={16}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Editor */}
        {creatorMode && (
          <ContentEditor
            title="Deployment Title"
            data={[{ id: 'deployment_title', content: deploymentTitle }]}
            onSave={(newData) => setDeploymentTitle(newData[0].content)}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[
              { key: 'content', label: 'Title', type: 'text', multilingual: true }
            ]}
            sectionKey="deployment_insights_title"
          />
        )}
        
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl text-secondary mb-4">
            {deploymentTitle[language]}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chart */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={deploymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deploymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, language === 'en' ? 'Share' : 'Pay']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {language === 'en' ? 'Cloud' : 'Bulut'}
                </div>
                <div className="text-4xl font-bold text-primary">60-70%</div>
              </div>
            </div> */}
          </div>

          {/* Legend and Features */}
          <div className="space-y-6">
            {deploymentData.map((item, index) => (
              <Card key={index} className="p-6 border-l-4" style={{ borderLeftColor: item.color }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                    {index === 0 ? 
                      <Cloud className="w-6 h-6" style={{ color: item.color }} /> : 
                      <Server className="w-6 h-6" style={{ color: item.color }} />
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary mb-2">{item.name}</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {item.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          {feature[language]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="font-semibold text-lg text-secondary">
              {language === 'en' ? 'Flexible Deployment Choice' : 'Esnek Dağıtım Seçimi'}
            </h3>
          </div>
          <p className="text-center text-gray-600">
            {language === 'en' 
              ? 'Choice per customer; can switch later. Each deployment option maintains the same functionality with different security and control levels.'
              : 'Müşteri başına seçim; daha sonra değiştirilebilir. Her dağıtım seçeneği farklı güvenlik ve kontrol seviyeleri ile aynı işlevselliği korur.'
            }
          </p>
        </Card>
      </div>
    </section>
  );
}