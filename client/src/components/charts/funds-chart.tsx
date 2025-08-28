import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { usePresentationContext } from '@/contexts/presentation-context';
import { ChartEditor } from '@/components/creator/chart-editor';
import { defaultChartData, chartStyling, ChartDataPoint } from '@/lib/chartUtils';

export function FundsChart() {
  const { creatorMode } = usePresentationContext();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    ...defaultChartData.funds
  ]);
  const [chartTitle, setChartTitle] = useState('Use of Funds');

  const handleSaveChart = (newData: ChartDataPoint[], newTitle?: string) => {
    setChartData(newData);
    if (newTitle) setChartTitle(newTitle);
  };

  const COLORS = chartStyling.pieColors;

  return (
    <div className="h-80 relative">
      {creatorMode && (
        <ChartEditor
          chartType="funds"
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
            label={({ name, percent, amount }) => `${name}: $${amount}K (${(percent * 100).toFixed(0)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string, props: any) => [`$${props.payload.amount}K (${value}%)`, 'Budget Allocation']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
