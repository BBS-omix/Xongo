import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Legend } from 'recharts';
import { usePresentationContext } from '@/contexts/presentation-context';
import { Card } from '@/components/ui/card';
import { ChartEditor } from '@/components/creator/chart-editor';
import { ChartDataPoint } from '@/lib/chartUtils';

export function ROITimelineChart() {
  const { language, creatorMode } = usePresentationContext();
  
  const [roiData, setRoiData] = useState<ChartDataPoint[]>([
    { month: 'Month 1', investment: -50000, savings: 0, cumulative: -50000, efficiency: 0 },
    { month: 'Month 2', investment: -75000, savings: 2000, cumulative: -73000, efficiency: 5 },
    { month: 'Month 3', investment: -90000, savings: 5000, cumulative: -85000, efficiency: 12 },
    { month: 'Month 4', investment: -100000, savings: 8000, cumulative: -92000, efficiency: 20 },
    { month: 'Month 5', investment: -105000, savings: 12000, cumulative: -93000, efficiency: 30 },
    { month: 'Month 6', investment: -110000, savings: 18000, cumulative: -92000, efficiency: 45 },
    { month: 'Month 7', investment: -115000, savings: 25000, cumulative: -90000, efficiency: 55 },
    { month: 'Month 8', investment: -120000, savings: 32000, cumulative: -88000, efficiency: 65 },
    { month: 'Month 9', investment: -125000, savings: 40000, cumulative: -85000, efficiency: 70 },
    { month: 'Month 10', investment: -130000, savings: 50000, cumulative: -80000, efficiency: 75 },
    { month: 'Month 11', investment: -135000, savings: 60000, cumulative: -75000, efficiency: 80 },
    { month: 'Month 12', investment: -140000, savings: 72000, cumulative: -68000, efficiency: 85 },
    { month: 'Month 15', investment: -150000, savings: 95000, cumulative: -55000, efficiency: 90 },
    { month: 'Month 18', investment: -160000, savings: 120000, cumulative: -40000, efficiency: 95 },
    { month: 'Month 24', investment: -180000, savings: 200000, cumulative: 20000, efficiency: 100 }
  ]);

  const [chartTitle, setChartTitle] = useState('Customer ROI Timeline');

  const handleSaveChart = (newData: ChartDataPoint[], newTitle?: string) => {
    setRoiData(newData);
    if (newTitle) setChartTitle(newTitle);
  };

  return (
    <div className="space-y-8">
      {/* ROI Timeline Chart */}
      <Card className="bg-white rounded-xl p-6 shadow-lg relative">
        {creatorMode && (
          <ChartEditor
            chartType="roi"
            title={chartTitle}
            data={roiData}
            onSave={handleSaveChart}
            className="absolute top-2 right-2 z-10"
          />
        )}
        
        <h3 className="text-xl font-bold text-secondary mb-4">
          {language === 'en' ? 'Customer ROI Timeline (Typical Enterprise)' : 'Müşteri ROI Zaman Çizelgesi (Tipik Kurumsal)'}
        </h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} fontSize={10} />
              <YAxis tickFormatter={(value: number) => `$${value/1000}K`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${Math.abs(value).toLocaleString()}`, 
                  name === 'cumulative' ? 'Net ROI' : 
                  name === 'investment' ? 'Total Investment' : 'Monthly Savings'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#10B981" 
                strokeWidth={3}
                name={language === 'en' ? 'Net ROI' : 'Net ROI'}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="investment" 
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name={language === 'en' ? 'Investment' : 'Yatırım'}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name={language === 'en' ? 'Monthly Savings' : 'Aylık Tasarruf'}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-800">
            <strong>{language === 'en' ? 'Break-even Point:' : 'Başabaş Noktası:'}</strong> Month 24 (~2 years)<br/>
            <strong>{language === 'en' ? 'Total ROI by Month 24:' : '24. Aya Kadar Toplam ROI:'}</strong> $200K+ positive return
          </div>
        </div>
      </Card>

      {/* Efficiency Gains Chart */}
      <Card className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-secondary mb-4">
          {language === 'en' ? 'Process Efficiency Gains Over Time' : 'Zaman İçinde Süreç Verimlilik Kazanımları'}
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} fontSize={10} />
              <YAxis domain={[0, 100]} tickFormatter={(value: number) => `${value}%`} />
              <Tooltip formatter={(value: number) => [`${value}%`, 'Efficiency Gain']} />
              <Area 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}