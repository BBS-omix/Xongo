import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

// ✅ Import the asset from src/ so Vite bundles it
import demoVideo from '@/data/resources/demo.mp4';

export function PersonaStories() {
  const { language, creatorMode } = usePresentationContext();
  const { personas } = presentationData;

  // State for editable content
  const [sectionTitle, setSectionTitle] = useState({
    en: 'Target Use Cases',
    tr: 'Hedef Kullanım Örnekleri',
  });
  const [personaList, setPersonaList] = useState(personas as any[]);

  // Video modal state (fullscreen)
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Lock scroll when modal open + ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVideoOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = isVideoOpen ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  // Resolve various ways a video can be referenced
  const resolveVideo = (src?: string | null) => {
    if (!src) return demoVideo;                 // default to the imported asset
    if (src === 'demo' || src.endsWith('demo.mp4')) return demoVideo;
    if (src.startsWith('http') || src.startsWith('/')) return src;
    // Any other relative token -> fall back to bundled demo
    return demoVideo;
  };

  const openVideo = (src?: string) => {
    setVideoUrl(resolveVideo(src));
    setIsVideoOpen(true);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-primary';
      case 'green':
        return 'bg-green-100 text-success';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'amber':
        return 'bg-yellow-100 text-accent';
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Editor */}
        {creatorMode && (
          <ContentEditor
            title="Section Title"
            data={[{ id: 'section_title', content: sectionTitle }]}
            onSave={(newData) => setSectionTitle(newData[0].content)}
            className="absolute top-4 right-4 z-10"
            type="text"
            fields={[{ key: 'content', label: 'Title', type: 'text', multilingual: true }]}
          />
        )}

        <h2 className="font-poppins font-bold text-3xl text-center text-secondary mb-12">
          {sectionTitle[language]}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Personas Editor */}
          {creatorMode && (
            <ContentEditor
              title="Personas"
              data={personaList}
              onSave={setPersonaList}
              className="absolute top-0 right-0 z-10"
              type="cards"
              fields={[
                { key: 'id', label: 'ID', type: 'text', multilingual: false },
                { key: 'title', label: 'Title', type: 'text', multilingual: true },
                { key: 'context', label: 'Context', type: 'text', multilingual: true },
                { key: 'description', label: 'Description', type: 'textarea', multilingual: true },
                { key: 'workflow', label: 'Workflow', type: 'textarea', multilingual: true },
                {
                  key: 'color',
                  label: 'Color',
                  type: 'select',
                  options: ['blue', 'green', 'purple', 'amber', 'red', 'indigo'],
                  multilingual: false,
                },
                // Optional: let a persona override the video
                { key: 'video', label: 'Video URL or "demo"', type: 'text', multilingual: false },
              ]}
            />
          )}

          {personaList.map((persona, idx) => (
            <Card key={persona.id} className="card-hover bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-12 h-12 ${getColorClasses(
                    persona.color
                  )} rounded-lg flex items-center justify-center`}
                >
                  <span className="font-bold">{persona.id}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary">{persona.title[language]}</h4>
                  <p className="text-sm text-gray-600">{persona.context[language]}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">{persona.description[language]}</p>

              {persona.workflow && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-xs font-semibold text-gray-600 mb-2">
                    {language === 'en' ? 'Workflow' : 'İş Akışı'}
                  </h5>
                  <p className="text-xs text-gray-600">{persona.workflow[language]}</p>
                </div>
              )}

              <div className="space-y-2">
                {persona.metrics?.map((metric: any, metricIndex: number) => (
                  <div key={metricIndex} className="flex justify-between text-xs">
                    <span className="text-gray-500">{metric.label[language]}</span>
                    <span className="font-semibold text-success">
                      {typeof metric.value === 'string' ? metric.value : metric.value[language]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Special actions for the FIRST card only - CENTERED */}
              {idx === 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => openVideo((persona as any)?.video)}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:opacity-90 transition"
                  >
                    {language === 'en' ? 'Watch Demo' : 'Demoyu İzle'}
                  </button>

                  <a
                    href="http://localhost:3000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-secondary text-secondary font-semibold hover:bg-secondary/10 transition"
                  >
                    {language === 'en' ? 'Open App' : 'Uygulamayı Aç'}
                  </a>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label={language === 'en' ? 'Demo Video' : 'Demo Videosu'}
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full h-full md:h-[80vh] md:w-[80vw] bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full px-3 py-1 text-sm"
            >
              {language === 'en' ? 'Close' : 'Kapat'}
            </button>

            <video
              key={videoUrl || demoVideo}        // force reload if src changes
              src={videoUrl || demoVideo}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onError={() => {
                // graceful fallback
                if (videoUrl !== demoVideo) setVideoUrl(demoVideo);
              }}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
