import React from 'react';
import { usePresentationContext } from '@/contexts/presentation-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VersionManager } from './version-manager';
import { Settings, Database, Palette, X, CheckCircle, Eye } from 'lucide-react';

export function CreatorPanel() {
  const { creatorMode, setCreatorMode, language } = usePresentationContext();
  

  if (!creatorMode) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4 pt-20">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-white relative mb-4">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCreatorMode(false)}
          className="absolute top-4 right-4 z-10 h-8 w-8 p-0 hover:bg-red-100 text-gray-500 hover:text-red-600"
          data-testid="button-close-creator-panel"
        >
          <X className="w-4 h-4" />
        </Button>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Creator Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {language === 'en' ? 'Creator Mode Active' : 'Yaratıcı Modu Aktif'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreatorMode(false)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                data-testid="button-deactivate-creator-mode"
              >
                {language === 'en' ? 'Exit Creator Mode' : 'Yaratıcı Modundan Çık'}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Version Management */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Version Management</h3>
              </div>
              <VersionManager />
            </div>
            
            {/* Chart Customization Info */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Chart Editing</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800 font-medium">
                        📝 {language === 'en' ? 'How to Edit Charts:' : 'Grafikleri Nasıl Düzenlersiniz:'}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {language === 'en' 
                          ? '1. Close this dashboard by clicking the X button above\n2. Scroll through the presentation\n3. Click the ✏️ edit button on any chart you want to modify' 
                          : '1. Yukarıdaki X düğmesine tıklayarak bu panoyu kapatın\n2. Sunumu kaydırın\n3. Değiştirmek istediğiniz herhangi bir grafikte ✏️ düzenle düğmesine tıklayın'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Available Chart Types:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Revenue & Burn Rate Chart (Line Chart)</li>
                    <li>• Use of Funds Chart (Pie Chart)</li>
                    <li>• Market Opportunity Chart (Bar Chart)</li>
                    <li>• Unit Economics Chart (Pie Chart)</li>
                    <li>• Financial Charts (Multiple Types)</li>
                    <li>• Customer Journey Timeline</li>
                    <li>• ROI Timeline Chart</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Features:</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Edit chart data in real-time</li>
                    <li>• Add/remove data points</li>
                    <li>• Customize chart titles</li>
                    <li>• Save different chart configurations</li>
                    <li>• Create multiple website versions</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}