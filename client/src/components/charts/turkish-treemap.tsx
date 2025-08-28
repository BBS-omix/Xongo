import React, { useState } from 'react';
import { usePresentationContext } from '@/contexts/presentation-context';
import { Card } from '@/components/ui/card';
import { ChartEditor } from '@/components/creator/chart-editor';
import { ChartDataPoint } from '@/lib/chartUtils';

export function TurkishTreemap() {
  const { language, creatorMode } = usePresentationContext();

  const [treemapData, setTreemapData] = useState<ChartDataPoint[]>([
    { 
      name: { en: 'Enterprise', tr: 'Kurumsal' },
      value: 60,
      color: '#60A5FA',
      acv: '$120K-250K+'
    },
    { 
      name: { en: 'Mid-Market', tr: 'Orta Pazar' },
      value: 30,
      color: '#34D399',
      acv: '$40K',
      highlighted: true
    },
    { 
      name: { en: 'SMB', tr: 'KOBİ' },
      value: 10,
      color: '#A78BFA',
      acv: '$8K-20K'
    }
  ]);
  const [chartTitle, setChartTitle] = useState('Unit Economics Treemap');

  const handleSaveChart = (newData: ChartDataPoint[], newTitle?: string) => {
    setTreemapData(newData);
    if (newTitle) setChartTitle(newTitle);
  };

  return
}