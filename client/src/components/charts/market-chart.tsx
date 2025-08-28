import React, { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { usePresentationContext } from '@/contexts/presentation-context';
import { ChartEditor } from '@/components/creator/chart-editor';
import { defaultChartData, ChartDataPoint } from '@/lib/chartUtils';

export function MarketChart() {
  const { language, creatorMode } = usePresentationContext();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    ...defaultChartData.market
  ]);
  const [chartTitle, setChartTitle] = useState('Market Opportunity by Segment');

  const handleSaveChart = (newData: ChartDataPoint[], newTitle?: string) => {
    setChartData(newData);
    if (newTitle) setChartTitle(newTitle);
  };

  return (
    <div className="h-80 relative">
      {creatorMode && (
        <ChartEditor
          chartType="market"
          title={chartTitle}
          data={chartData}
          onSave={handleSaveChart}
          className="absolute top-0 right-0 z-10"
        />
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="segment" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip 
            formatter={(value: number) => [`$${value}B`, '']}
            labelStyle={{ color: 'hsl(220, 87%, 4%)' }}
          />
          <Legend />
          <Bar dataKey="2024" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="2030" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
