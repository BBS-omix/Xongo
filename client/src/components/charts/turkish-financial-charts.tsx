import React, { useState } from 'react';
import { usePresentationContext } from '@/contexts/presentation-context';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { ChartEditor } from '@/components/creator/chart-editor';
import { ChartDataPoint } from '@/lib/chartUtils';

export function TurkishFinancialCharts() {
  const { language, creatorMode } = usePresentationContext();

  // Investment Usage (Yatırım Kullanımı) Data
  const [investmentUsageData, setInvestmentUsageData] = useState<ChartDataPoint[]>([
    { name: { en: 'Hardware', tr: 'Donanım' }, value: 40, amount: 300, color: '#60A5FA' },
    { name: { en: 'Personnel', tr: 'Personel' }, value: 43, amount: 321, color: '#34D399' },
     { name: { en: 'Marketing', tr: 'Pazarlama' }, value: 8, amount: 60, color: '#15715A' },
    { name: { en: 'Other', tr: 'Diğer' }, value: 9, amount: 69, color: '#A78BFA' }
  ]);

  // Revenue-Expense Expectations (Gelir-Gider Beklentileri) Data
  const [revenueExpenseData, setRevenueExpenseData] = useState<ChartDataPoint[]>([
    { month: '2026 Mayıs', revenue: 22000, expense: 642000 },
    { month: '2026 Haziran', revenue: 44000, expense: 697000 },
    { month: '2026 Temmuz', revenue: 66000, expense: 724000 },
    { month: '2026 Ağustos', revenue: 88000, expense: 752000 },
    { month: '2026 Eylül', revenue: 133600, expense: 802000 },
    { month: '2026 Ekim', revenue: 198100, expense: 852000 },
    { month: '2026 Kasım', revenue: 324800, expense: 902000 },
    { month: '2026 Aralık', revenue: 524300, expense: 978000 },
    { month: '2027 Ocak', revenue: 745000, expense: 1054000 },
    { month: '2027 Şubat', revenue: 965700, expense: 1130000 },
    { month: '2027 Mart', revenue: 1229700, expense: 1206000 },
    { month: '2027 Nisan', revenue: 1502000, expense: 1282000 },
    { month: '2027 Mayıs', revenue: 1776600, expense: 1358000 }
  ]);

  // Revenue Expectations (Gelir Beklentileri) Stacked Area Data  
  const [revenueExpectationsData, setRevenueExpectationsData] = useState<ChartDataPoint[]>([
    { month: '2026 Mayıs', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 0 },
    { month: '2026 Haziran', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2026 Temmuz', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2026 Ağustos', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2026 Eylül', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2026 Ekim', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2026 Kasım', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2026 Aralık', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2027 Ocak', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2027 Şubat', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2027 Mart', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2027 Nisan', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 },
    { month: '2027 Mayıs', pilot1: 6000, pilot2: 6000, pilot3: 10000, musteri: 22000 }
  ]);

  // Cost Expectations Cumulative (Maliyet Beklentileri) Data
  const [costExpectationsData, setCostExpectationsData] = useState<ChartDataPoint[]>([
    { month: '2025 Eylül', hardware: 300000, personnel: 8000, other: 4500 },
    { month: '2025 Ekim', hardware: 300000, personnel: 16000, other: 6500 },
    { month: '2025 Kasım', hardware: 300000, personnel: 32250, other: 11000 },
    { month: '2025 Aralık', hardware: 300000, personnel: 48500, other: 15500 },
    { month: '2026 Ocak', hardware: 300000, personnel: 64750, other: 20000 },
    { month: '2026 Şubat', hardware: 300000, personnel: 81000, other: 24500 },
    { month: '2026 Mart', hardware: 300000, personnel: 97250, other: 29000 },
    { month: '2026 Nisan', hardware: 300000, personnel: 113500, other: 33500 },
    { month: '2026 Mayıs', hardware: 300000, personnel: 129750, other: 38000 },
    { month: '2026 Haziran', hardware: 300000, personnel: 146000, other: 42500 }
  ]);

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
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl text-secondary mb-4">
            {language === 'en' ? 'Financial Analysis Charts' : 'Mali Analiz Grafikleri'}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Detailed financial projections and business metrics from original analysis'
              : 'Orijinal analizden detaylı mali projeksiyonlar ve işletme metrikleri'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Investment Usage Chart */}
          <Card className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-secondary mb-4">
              {language === 'en' ? 'Investment Usage (Sep 2025 - Aug 2026)' : 'Yatırım Kullanımı (2025 Eylül - 2026 Ağustos)'}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {investmentUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any, props: any) => [`${value}% ($${props.payload.amount}K)`, props.payload.name[language]]} />
                  <Legend formatter={(value: any, entry: any) => entry.payload.name[language]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {investmentUsageData.map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-700">{item.name[language]}: {item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue-Expense Expectations */}
          <Card className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-secondary mb-4">
              {language === 'en' ? 'Revenue-Expense Expectations (Monthly Total)' : 'Gelir-Gider Beklentileri (Toplam Aylık)'}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={10}
                  />
                  <YAxis tickFormatter={(value: number) => `$${value/1000}K`} />
                  <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#06B6D4" 
                    strokeWidth={3}
                    name={language === 'en' ? 'Revenue' : 'Gelir'}
                    dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#1F2937" 
                    strokeWidth={3}
                    name={language === 'en' ? 'Expenses' : 'Giderler'}
                    dot={{ fill: '#1F2937', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
           
          </Card>
        </div>

        {/* Full Width Charts */}
      
      </div>
    </section>
  );
}