import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { usePresentationContext } from '@/contexts/presentation-context';
import { ChartEditor } from '@/components/creator/chart-editor';
import { defaultChartData, chartStyling, ChartDataPoint } from '@/lib/chartUtils';

export function UnitEconomicsChart() {
  const { creatorMode } = usePresentationContext();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    ...defaultChartData.unitEconomics
  ]);
  const [chartTitle, setChartTitle] = useState('Unit Economics');

  const handleSaveChart = (newData: ChartDataPoint[], newTitle?: string) => {
    setChartData(newData);
    if (newTitle) setChartTitle(newTitle);
  };

  const COLORS = chartStyling.pieColors;

  return (
    <div className="h-80 relative">
      {creatorMode && (
        <ChartEditor
          chartType="unitEconomics"
          title={chartTitle}
          data={chartData}
          onSave={handleSaveChart}
          className="absolute top-0 right-0 z-10"
        />
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value}%`, 'Revenue Share']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
