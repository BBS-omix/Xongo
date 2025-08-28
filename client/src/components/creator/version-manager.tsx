import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Eye, Trash2, Play } from 'lucide-react';
import { versionAPI } from '@/lib/chartUtils';
import type { WebsiteVersion, InsertWebsiteVersion } from '@shared/schema';

export function VersionManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all versions
  const { data: versions = [], isLoading } = useQuery({
    queryKey: ['/api/versions'],
    queryFn: versionAPI.getAll,
  });

  // Fetch active version
  const { data: activeVersion } = useQuery({
    queryKey: ['/api/versions/active'],
    queryFn: versionAPI.getActive,
  });

  // Create version mutation
  const createVersionMutation = useMutation({
    mutationFn: versionAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/versions'] });
      setIsCreating(false);
      setNewVersionName('');
      setNewVersionDescription('');
      toast({
        title: "Success",
        description: "Website version created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create version",
        variant: "destructive",
      });
    },
  });

  // Activate version mutation
  const activateVersionMutation = useMutation({
    mutationFn: versionAPI.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/versions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/versions/active'] });
      toast({
        title: "Success",
        description: "Version activated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to activate version",
        variant: "destructive",
      });
    },
  });

  // Delete version mutation
  const deleteVersionMutation = useMutation({
    mutationFn: versionAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/versions'] });
      toast({
        title: "Success",
        description: "Version deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete version",
        variant: "destructive",
      });
    },
  });

  const handleCreateVersion = () => {
    if (!newVersionName.trim()) {
      toast({
        title: "Error",
        description: "Version name is required",
        variant: "destructive",
      });
      return;
    }

    const newVersion: InsertWebsiteVersion = {
      name: newVersionName,
      description: newVersionDescription || null,
      isActive: false,
      chartConfigs: [], // This will be populated with current chart configs
    };

    createVersionMutation.mutate(newVersion);
  };

  const handleActivateVersion = (id: string) => {
    activateVersionMutation.mutate(id);
  };

  const handleDeleteVersion = (id: string) => {
    if (activeVersion?.id === id) {
      toast({
        title: "Error",
        description: "Cannot delete the active version",
        variant: "destructive",
      });
      return;
    }
    deleteVersionMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="p-4">Loading versions...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Website Versions</h3>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="flex items-center space-x-2"
              data-testid="button-create-version"
            >
              <Plus className="w-4 h-4" />
              <span>Save Current Version</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Website Version</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="version-name">Version Name</Label>
                <Input
                  id="version-name"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="e.g., v1.2 - Updated Charts"
                  data-testid="input-version-name"
                />
              </div>
              
              <div>
                <Label htmlFor="version-description">Description (Optional)</Label>
                <Textarea
                  id="version-description"
                  value={newVersionDescription}
                  onChange={(e) => setNewVersionDescription(e.target.value)}
                  placeholder="Describe what changed in this version..."
                  data-testid="textarea-version-description"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  data-testid="button-cancel-version"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateVersion}
                  disabled={createVersionMutation.isPending}
                  data-testid="button-save-version"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Version
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Versions List */}
      <div className="space-y-3">
        {versions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No saved versions yet. Create your first version above.
          </p>
        ) : (
          versions.map((version) => (
            <Card key={version.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{version.name}</h4>
                    {version.isActive && (
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(version.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                  {version.description && (
                    <p className="text-sm text-gray-600 mt-1">{version.description}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {!version.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActivateVersion(version.id)}
                      disabled={activateVersionMutation.isPending}
                      data-testid={`button-activate-${version.id}`}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Activate
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVersion(version.id)}
                    disabled={deleteVersionMutation.isPending || Boolean(version.isActive)}
                    className="text-red-600 hover:text-red-800"
                    data-testid={`button-delete-${version.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
}