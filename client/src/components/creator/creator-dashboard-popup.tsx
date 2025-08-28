import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePresentationContext } from '@/contexts/presentation-context';
import { Settings, CheckCircle, Database, Palette, X } from 'lucide-react';
import { VersionManager } from '@/components/creator/version-manager';

interface CreatorDashboardPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorDashboardPopup({ isOpen, onClose }: CreatorDashboardPopupProps) {
  const { language, setCreatorMode } = usePresentationContext();

  const handleExitCreatorMode = () => {
    setCreatorMode(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-primary" />
            <DialogTitle className="text-2xl font-bold">Creator Dashboard</DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-200"
            data-testid="button-close-creator-dashboard"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Status and Exit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {language === 'en' ? 'Creator Mode Active' : 'Yaratıcı Modu Aktif'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExitCreatorMode}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              data-testid="button-exit-creator-mode"
            >
              {language === 'en' ? 'Exit Creator Mode' : 'Yaratıcı Modundan Çık'}
            </Button>
          </div>

          {/* Version Management */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Version Management' : 'Versiyon Yönetimi'}
              </h3>
            </div>
            <VersionManager />
          </Card>

          {/* Design Tools Instructions */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Content Editing' : 'İçerik Düzenleme'}
              </h3>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-800 font-medium">
                    📝 {language === 'en' ? 'How to Edit Content:' : 'İçeriği Nasıl Düzenlersiniz:'}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {language === 'en' 
                      ? '1. Close this popup by clicking the X button or clicking outside • 2. Scroll through the presentation • 3. Click the ✏️ edit button on any section you want to modify'
                      : '1. X butonuna tıklayarak veya dışarıya tıklayarak bu popup\'ı kapatın • 2. Sunumda gezinin • 3. Düzenlemek istediğiniz herhangi bir bölümde ✏️ düzenle butonuna tıklayın'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                {language === 'en' ? 'Available Sections:' : 'Mevcut Bölümler:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>{language === 'en' ? 'Hero Section' : 'Ana Bölüm'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>{language === 'en' ? 'Problem & Solution' : 'Sorun ve Çözüm'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{language === 'en' ? 'What We Offer' : 'Neler Sunuyoruz'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>{language === 'en' ? 'Business Model' : 'İş Modeli'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>{language === 'en' ? 'Market Opportunity' : 'Pazar Fırsatı'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span>{language === 'en' ? 'KPIs & Metrics' : 'KPI ve Metrikler'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>{language === 'en' ? 'Roadmap' : 'Yol Haritası'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                  <span>{language === 'en' ? 'Financial Charts' : 'Finansal Grafikler'}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}