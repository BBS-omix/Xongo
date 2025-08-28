import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePresentationContext } from '@/contexts/presentation-context';
import { ChartEditor } from '@/components/creator/chart-editor';
import { defaultChartData, ChartDataPoint } from '@/lib/chartUtils';

export function RevenueChart() {
  const { creatorMode } = usePresentationContext();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    ...defaultChartData.revenue
  ]);
  const [chartTitle, setChartTitle] = useState('Revenue & Burn Rate');

  const handleSaveChart = (newData: ChartDataPoint[], newTitle?: string) => {
    setChartData(newData);
    if (newTitle) setChartTitle(newTitle);
  };

  return (
    <div className="h-80 relative">
      {creatorMode && (
        <ChartEditor
          chartType="revenue"
          title={chartTitle}
          data={chartData}
          onSave={handleSaveChart}
          className="absolute top-0 right-0 z-10"
        />
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip formatter={(value: number) => [`$${Math.abs(value)}K`, '']} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Revenue" 
            stroke="hsl(142, 76%, 36%)" 
            strokeWidth={3}
            dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="Burn Rate" 
            stroke="hsl(0, 84%, 60%)" 
            strokeWidth={3}
            dot={{ fill: 'hsl(0, 84%, 60%)', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="Cumulative" 
            stroke="hsl(217, 91%, 60%)" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
