import { useState } from 'react';
import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';

export function Roadmap() {
  const { language, complexity, creatorMode } = usePresentationContext();
  const { roadmap } = presentationData;
  
  // State for editable roadmap phases
  const [roadmapPhases, setRoadmapPhases] = useState(roadmap.phases);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return { bg: 'bg-blue-600', card: 'bg-blue-50', text: 'text-white' };
      case 'success':
        return { bg: 'bg-green-600', card: 'bg-green-50', text: 'text-white' };
      case 'accent':
        return { bg: 'bg-yellow-500', card: 'bg-yellow-50', text: 'text-gray-800' };
      case 'purple':
        return { bg: 'bg-purple-600', card: 'bg-purple-50', text: 'text-white' };
      case 'indigo':
        return { bg: 'bg-indigo-600', card: 'bg-indigo-50', text: 'text-white' };
      default:
        return { bg: 'bg-gray-600', card: 'bg-gray-50', text: 'text-white' };
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          {creatorMode && (
            <ContentEditor
              title="Roadmap Phases"
              data={roadmapPhases}
              onSave={setRoadmapPhases}
              className="absolute top-0 right-0 z-10"
              type="cards"
              fields={[
                { key: 'title', label: 'Phase Title', type: 'text', multilingual: true },
                { key: 'items', label: 'Items (comma-separated)', type: 'textarea', multilingual: true },
                { key: 'color', label: 'Color', type: 'text', multilingual: false }
              ]}
              sectionKey="roadmap_phases"
            />
          )}
          <h2 className="font-poppins font-bold text-3xl text-center text-secondary mb-12">
            {roadmap.title[language]}
          </h2>
        </div>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200"></div>
          
          <div className="space-y-12">
            {roadmapPhases.map((phase, index) => {
              const colors = getColorClasses(phase.color);
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className="flex items-center">
                  {isEven ? (
                    <>
                      <div className="flex-1 pr-8 text-right">
                        <div className={`${colors.card} rounded-xl p-6`}>
                          <h4 className="font-semibold text-secondary mb-2">
                            {phase.title[language]}
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-600">
                            {(Array.isArray(phase.items) ? phase.items : 
                              typeof phase.items === 'string' ? 
                                phase.items.split(',').map(i => ({ en: i.trim(), tr: i.trim() })) :
                                []
                            ).map((item, itemIndex) => (
                              <li key={itemIndex}>{typeof item === 'string' ? item : item[language]}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center ${colors.text} font-bold text-lg z-10`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 pl-8"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 pr-8"></div>
                      <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center ${colors.text} font-bold text-lg z-10`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 pl-8">
                        <div className={`${colors.card} rounded-xl p-6`}>
                          <h4 className="font-semibold text-secondary mb-2">
                            {phase.title[language]}
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-600">
                            {(Array.isArray(phase.items) ? phase.items : 
                              typeof phase.items === 'string' ? 
                                phase.items.split(',').map(i => ({ en: i.trim(), tr: i.trim() })) :
                                []
                            ).map((item, itemIndex) => (
                              <li key={itemIndex}>{typeof item === 'string' ? item : item[language]}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
