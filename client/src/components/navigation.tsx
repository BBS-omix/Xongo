import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePresentationContext } from '@/contexts/presentation-context';
import { useQuery } from '@tanstack/react-query';
import { versionAPI } from '@/lib/chartUtils';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Eye } from 'lucide-react';
import { useState } from 'react';
import { CreatorDashboardPopup } from '@/components/creator/creator-dashboard-popup';

export function Navigation() {
  const { language, complexity, creatorMode, setLanguage, setComplexity, setCreatorMode } = usePresentationContext();
  const { toast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCreatorPanel, setShowCreatorPanel] = useState(false);

  const CREATOR_PASSWORD = 'Hakanım!123!';
  
  
  // Fetch all versions for presentation selection
  const { data: versions = [] } = useQuery({
    queryKey: ['/api/versions'],
    queryFn: versionAPI.getAll,
  });

  // Fetch active version
  const { data: activeVersion } = useQuery({
    queryKey: ['/api/versions/active'],
    queryFn: versionAPI.getActive,
  });

  const handleCreatorModeToggle = () => {
    if (creatorMode) {
      // If creator mode is active, show the panel
      setShowCreatorPanel(true);
    } else {
      // Activating creator mode - show password dialog
      setShowPasswordDialog(true);
      setPassword('');
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = () => {
    if (password === CREATOR_PASSWORD) {
      setCreatorMode(true);
      setShowCreatorPanel(true);
      setShowPasswordDialog(false);
      setPassword('');
      setPasswordError('');
      toast({
        title: "Creator Mode Activated",
        description: "Edit buttons will appear on charts and sections. Close the Creator Dashboard to see them.",
        duration: 4000,
      });
    } else {
      setPasswordError(language === 'en' ? 'Incorrect password' : 'Yanlış şifre');
    }
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  return (
    <nav className="sticky top-0 z-50 glassmorphism">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">X</span>
            </div>
            <h1 className="font-poppins font-bold text-2xl text-secondary">Xong</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Presentation Selection */}
            {versions.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-secondary">Presentation:</span>
                <Select 
                  value={activeVersion?.id || ''} 
                  onValueChange={(versionId) => versionAPI.activate(versionId)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        {version.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            

            {/* Creator Mode Toggle with Password Protection */}
            <Button
              variant={creatorMode ? "default" : "outline"}
              size="sm"
              onClick={handleCreatorModeToggle}
              className={`flex items-center space-x-2 ${creatorMode ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
              data-testid="button-creator-mode"
            >
              {creatorMode ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{creatorMode ? "Dashboard" : "Creator Mode"}</span>
            </Button>
            
            {/* Password Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>
                      {language === 'en' ? 'Creator Mode Access' : 'Yaratıcı Modu Erişimi'}
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="creator-password">
                      {language === 'en' ? 'Enter Creator Password:' : 'Yaratıcı Şifresini Girin:'}
                    </Label>
                    <Input
                      id="creator-password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      onKeyPress={handlePasswordKeyPress}
                      placeholder={language === 'en' ? 'Password' : 'Şifre'}
                      className={passwordError ? 'border-red-500' : ''}
                      data-testid="input-creator-password"
                      autoFocus
                    />
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPasswordDialog(false);
                        setPassword('');
                        setPasswordError('');
                      }}
                      data-testid="button-cancel-password"
                    >
                      {language === 'en' ? 'Cancel' : 'İptal'}
                    </Button>
                    <Button
                      onClick={handlePasswordSubmit}
                      disabled={!password}
                      className="flex items-center space-x-2"
                      data-testid="button-submit-password"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>{language === 'en' ? 'Activate' : 'Etkinleştir'}</span>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-secondary">Language:</span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="tr">Türkçe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-secondary">Complexity:</span>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simplified Creator Dashboard Popup */}
      <CreatorDashboardPopup
        isOpen={showCreatorPanel}
        onClose={() => setShowCreatorPanel(false)}
      />
    </nav>
  );
}
