import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { useState, useEffect } from 'react';
import { contentAPI } from '@/lib/chartUtils';

export function Hero() {
  const { language, creatorMode } = usePresentationContext();
  const { hero } = presentationData;
  
  // State for editable content
  const [heroTitle, setHeroTitle] = useState(hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(hero.subtitle);
  const [heroMetrics, setHeroMetrics] = useState(hero.metrics);

  // Load saved content on mount
  useEffect(() => {
    const loadSavedContent = async () => {
      try {
        // Load hero title
        const savedTitle = await contentAPI.get('hero_title');
        if (savedTitle && savedTitle.data && savedTitle.data[0] && savedTitle.data[0].content) {
          setHeroTitle(savedTitle.data[0].content);
        }

        // Load hero subtitle
        const savedSubtitle = await contentAPI.get('hero_subtitle');
        if (savedSubtitle && savedSubtitle.data && savedSubtitle.data[0] && savedSubtitle.data[0].content) {
          setHeroSubtitle(savedSubtitle.data[0].content);
        }

        // Load hero metrics
        const savedMetrics = await contentAPI.get('hero_metrics');
        if (savedMetrics && savedMetrics.data) {
          setHeroMetrics(savedMetrics.data);
        }
      } catch (error) {
        console.error('Failed to load saved hero content:', error);
      }
    };

    loadSavedContent();
  }, []);

  return (
    <section className="gradient-bg text-white py-20 relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Hero Title Editor */}
        {creatorMode && (
          <ContentEditor
            title="Hero Title"
            data={[{ id: 'hero_title', content: heroTitle }]}
            onSave={(newData) => setHeroTitle(newData[0].content)}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[
              { key: 'content', label: 'Hero Title', type: 'text', multilingual: true }
            ]}
            sectionKey="hero_title"
          />
        )}
        
        <h1 className="font-poppins font-bold text-5xl mb-6">
          {heroTitle[language]}
        </h1>
        
        {/* Hero Subtitle Editor */}
        {creatorMode && (
          <ContentEditor
            title="Hero Subtitle"
            data={[{ id: 'hero_subtitle', content: heroSubtitle }]}
            onSave={(newData) => setHeroSubtitle(newData[0].content)}
            className="absolute top-16 right-4 z-10"
            type="text"
            fields={[
              { key: 'content', label: 'Hero Subtitle', type: 'textarea', multilingual: true }
            ]}
            sectionKey="hero_subtitle"
          />
        )}
        
        <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
          {heroSubtitle[language]}
        </p>
        <div className="flex justify-center space-x-6 relative">
          {/* Hero Metrics Editor */}
          {creatorMode && (
            <ContentEditor
              title="Hero Metrics"
              data={heroMetrics}
              onSave={setHeroMetrics}
              className="absolute top-0 right-0 z-10"
              type="cards"
              fields={[
                { key: 'value', label: 'Metric Value', type: 'text', multilingual: false },
                { key: 'label', label: 'Metric Label', type: 'text', multilingual: true }
              ]}
              sectionKey="hero_metrics"
            />
          )}
          {heroMetrics.map((metric, index) => (
            <button 
              key={index} 
              className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 hover:bg-white/20 hover:scale-105 transition-all duration-300 group"
              data-testid={`metric-button-${index}`}
            >
              <div className="text-3xl font-bold group-hover:text-primary transition-colors duration-300">{metric.value}</div>
              <div className="text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">{metric.label[language]}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
