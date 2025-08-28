import { usePresentationContext } from '@/contexts/presentation-context';
import { presentationData } from '@/data/presentation-data';
import { ContentEditor } from '@/components/creator/content-editor';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Database, Search, ShieldCheck, ArrowRight, FileText } from 'lucide-react';

export function ProblemSolution() {
  const { language, creatorMode } = usePresentationContext();
  const { problemSolution } = presentationData;
  
  // State for editable content
  const [problemTitle, setProblemTitle] = useState(problemSolution.problem.title);
  const [problemSubtitle, setProblemSubtitle] = useState(problemSolution.problem.subtitle);
  const [problemPoints, setProblemPoints] = useState(problemSolution.problem.points);
  const [solutionTitle, setSolutionTitle] = useState(problemSolution.solution.title);
  const [solutionSubtitle, setSolutionSubtitle] = useState(problemSolution.solution.subtitle);
  const [solutionPipeline, setSolutionPipeline] = useState(problemSolution.solution.pipeline);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'database':
        return <Database className="w-8 h-8" />;
      case 'search':
        return <Search className="w-8 h-8" />;
      case 'shield-check':
        return <ShieldCheck className="w-8 h-8" />;
      case 'arrow-right':
        return <ArrowRight className="w-8 h-8" />;
      case 'file-text':
        return <FileText className="w-8 h-8" />;
      default:
        return <Database className="w-8 h-8" />;
    }
  };

  const getIconColor = (index: number) => {
    const colors = ['text-primary', 'text-success', 'text-accent', 'text-purple-600', 'text-indigo-600'];
    return colors[index % colors.length];
  };

  const getBgColor = (index: number) => {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-indigo-100'];
    return colors[index % colors.length];
  };

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Problem */}
          <div className="space-y-6 relative">
            {/* Problem Title Editor */}
            {creatorMode && (
              <ContentEditor
                title="Problem Title"
                data={[{ id: 'problem_title', content: problemTitle }]}
                onSave={(newData) => setProblemTitle(newData[0].content)}
                className="absolute top-0 right-0 z-10"
                type="text"
                fields={[
                  { key: 'content', label: 'Problem Title', type: 'text', multilingual: true }
                ]}
                sectionKey="problem_solution_problem_title"
              />
            )}
            
            <div>
              <h3 className="font-poppins font-bold text-3xl text-secondary mb-2">
                {problemTitle[language]}
              </h3>
              <p className="text-gray-600 mb-6">{problemSolution.problem.subtitle[language]}</p>
            </div>
            <Card className="bg-white rounded-xl p-6 shadow-lg relative">
              {/* Problem Points Editor */}
              {creatorMode && (
                <ContentEditor
                  title="Problem Points"
                  data={problemPoints}
                  onSave={setProblemPoints}
                  className="absolute top-2 right-2 z-10"
                  type="list"
                  fields={[
                    { key: 'text', label: 'Point Text', type: 'text', multilingual: true }
                  ]}
                  sectionKey="problem_solution_problem_points"
                />
              )}
              <div className="space-y-4">
                {problemPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="text-sm">{point[language]}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Solution */}
          <div className="space-y-6 relative">
            {/* Solution Title Editor */}
            {creatorMode && (
              <ContentEditor
                title="Solution Title"
                data={[{ id: 'solution_title', content: solutionTitle }]}
                onSave={(newData) => setSolutionTitle(newData[0].content)}
                className="absolute top-0 right-0 z-10"
                type="text"
                fields={[
                  { key: 'content', label: 'Solution Title', type: 'text', multilingual: true }
                ]}
                sectionKey="problem_solution_solution_title"
              />
            )}
            <div>
              <h3 className="font-poppins font-bold text-3xl text-secondary mb-2">
                {solutionTitle[language]}
              </h3>
              {/* Solution Subtitle Editor */}
              {creatorMode && (
                <ContentEditor
                  title="Solution Subtitle"
                  data={[{ id: 'solution_subtitle', content: solutionSubtitle }]}
                  onSave={(newData) => setSolutionSubtitle(newData[0].content)}
                  className="absolute top-12 right-0 z-10"
                  type="text"
                  fields={[
                    { key: 'content', label: 'Solution Subtitle', type: 'textarea', multilingual: true }
                  ]}
                  sectionKey="problem_solution_solution_subtitle"
                />
              )}
              <p className="text-gray-600 mb-6">{solutionSubtitle[language]}</p>
            </div>
            <Card className="bg-white rounded-xl p-6 shadow-lg relative">
              {/* Solution Pipeline Editor */}
              {creatorMode && (
                <ContentEditor
                  title="Solution Pipeline"
                  data={solutionPipeline}
                  onSave={setSolutionPipeline}
                  className="absolute top-2 right-2 z-10"
                  type="cards"
                  fields={[
                    { key: 'label', label: 'Step Label', type: 'text', multilingual: true },
                    { key: 'description', label: 'Description', type: 'textarea', multilingual: true },
                    { key: 'icon', label: 'Icon Name', type: 'text', multilingual: false }
                  ]}
                  sectionKey="problem_solution_solution_pipeline"
                />
              )}
              <div className="grid grid-cols-1 gap-4">
                {solutionPipeline.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getBgColor(index)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <div className={getIconColor(index)}>
                        {getIcon(step.icon)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-secondary">{step.label[language]}</div>
                      <div className="text-sm text-gray-600">{step.description?.[language]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
