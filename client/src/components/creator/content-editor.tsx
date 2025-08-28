import React, { useState, useEffect } from 'react';
import { usePresentationContext } from '@/contexts/presentation-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Edit, Plus, Trash2, Save, X, Settings, Minus } from 'lucide-react';
import { contentAPI } from '@/lib/chartUtils';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id?: string;
  [key: string]: any;
}

interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  multilingual?: boolean;
  options?: string[]; // For select fields
}

interface ContentEditorProps {
  title: string;
  data: any[];
  onSave: (newData: any[]) => void;
  className?: string;
  type: 'cards' | 'table' | 'list' | 'text';
  fields: ContentField[];
  sectionKey: string; // Unique key to identify this content section for persistence
}

export function ContentEditor({ title, data, onSave, className, type, fields, sectionKey }: ContentEditorProps) {
  const { complexity } = usePresentationContext();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<any[]>(data || []);
  const [editableFields, setEditableFields] = useState<ContentField[]>(fields || []);
  const [showFieldEditor, setShowFieldEditor] = useState(false);

  // Load saved content on mount
  useEffect(() => {
    const loadSavedContent = async () => {
      try {
        const savedData = await contentAPI.get(sectionKey);
        if (savedData && savedData.data) {
          setEditableData(savedData.data);
        }
        if (savedData && savedData.fields) {
          setEditableFields(savedData.fields);
        }
      } catch (error) {
        console.error('Failed to load saved content:', error);
      }
    };

    if (sectionKey) {
      loadSavedContent();
    }
  }, [sectionKey]);

  // Advanced field management functions
  const addNewField = () => {
    const newField: ContentField = {
      key: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      multilingual: false
    };
    setEditableFields([...editableFields, newField]);
  };

  const removeField = (fieldIndex: number) => {
    const field = editableFields[fieldIndex];
    setEditableFields(editableFields.filter((_, i) => i !== fieldIndex));
    
    // Remove the field data from all items
    const updatedData = editableData.map(item => {
      const newItem = { ...item };
      delete newItem[field.key];
      return newItem;
    });
    setEditableData(updatedData);
  };

  const updateField = (fieldIndex: number, updates: Partial<ContentField>) => {
    const updatedFields = [...editableFields];
    updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], ...updates };
    setEditableFields(updatedFields);
  };

  const addNewItem = () => {
    const newItem: any = {};
    editableFields.forEach(field => {
      if (field.multilingual) {
        newItem[field.key] = { en: '', tr: '' };
      } else {
        newItem[field.key] = field.type === 'number' ? 0 : '';
      }
    });
    newItem.id = `item_${Date.now()}`;
    setEditableData([...editableData, newItem]);
  };

  const removeItem = (index: number) => {
    setEditableData(editableData.filter((_, i) => i !== index));
  };

  const updateValue = (itemIndex: number, fieldKey: string, value: any, language?: 'en' | 'tr') => {
    const updated = [...editableData];
    const item = { ...updated[itemIndex] };
    
    if (language) {
      item[fieldKey] = { ...item[fieldKey], [language]: value };
    } else {
      item[fieldKey] = value;
    }
    
    updated[itemIndex] = item;
    setEditableData(updated);
  };

  const handleSave = async () => {
    try {
      console.log('ContentEditor handleSave called with sectionKey:', sectionKey);
      
      if (!sectionKey) {
        throw new Error('sectionKey is required for saving content');
      }

      // Save to backend
      await contentAPI.update(sectionKey, {
        data: editableData,
        fields: editableFields
      });
      
      // Call the original onSave callback for local state updates
      onSave(editableData);
      
      setIsEditing(false);
      setShowFieldEditor(false);
      
      toast({
        title: "Content Saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save content:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    // Reload from backend to revert any unsaved changes
    try {
      const savedData = await contentAPI.get(sectionKey);
      if (savedData && savedData.data) {
        setEditableData(savedData.data);
      } else {
        setEditableData(data);
      }
      if (savedData && savedData.fields) {
        setEditableFields(savedData.fields);
      } else {
        setEditableFields(fields);
      }
    } catch (error) {
      // Fallback to original data if backend fails
      setEditableData(data);
      setEditableFields(fields);
    }
    
    setIsEditing(false);
    setShowFieldEditor(false);
  };

  const renderField = (item: ContentItem, itemIndex: number, field: any) => {
    const value = item[field.key];
    
    if (field.multilingual && typeof value === 'object') {
      return (
        <div key={field.key} className="space-y-2">
          <Label className="text-xs font-medium">{field.label}</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">English</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={value.en || ''}
                  onChange={(e) => updateValue(itemIndex, field.key, e.target.value, 'en')}
                  className="text-xs"
                  rows={2}
                />
              ) : (
                <Input
                  value={value.en || ''}
                  onChange={(e) => updateValue(itemIndex, field.key, e.target.value, 'en')}
                  className="text-xs"
                />
              )}
            </div>
            <div>
              <Label className="text-xs text-gray-500">Turkish</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={value.tr || ''}
                  onChange={(e) => updateValue(itemIndex, field.key, e.target.value, 'tr')}
                  className="text-xs"
                  rows={2}
                />
              ) : (
                <Input
                  value={value.tr || ''}
                  onChange={(e) => updateValue(itemIndex, field.key, e.target.value, 'tr')}
                  className="text-xs"
                />
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-1">
        <Label className="text-xs font-medium">{field.label}</Label>
        {field.type === 'textarea' ? (
          <Textarea
            value={value || ''}
            onChange={(e) => updateValue(itemIndex, field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            className="text-xs"
            rows={2}
          />
        ) : field.type === 'select' ? (
          <Select value={value || ''} onValueChange={(newValue) => updateValue(itemIndex, field.key, newValue)}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type={field.type === 'number' ? 'number' : 'text'}
            value={value || ''}
            onChange={(e) => updateValue(itemIndex, field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            className="text-xs"
          />
        )}
      </div>
    );
  };

  const renderFieldEditor = () => {
    return (
      <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm text-blue-800">Field Structure Editor</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFieldEditor(false)}
            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {editableFields.map((field, fieldIndex) => (
            <div key={field.key} className="bg-white p-3 rounded border border-blue-200">
              <div className="grid grid-cols-4 gap-2 items-end">
                <div>
                  <Label className="text-xs">Field Key</Label>
                  <Input
                    value={field.key}
                    onChange={(e) => updateField(fieldIndex, { key: e.target.value })}
                    className="text-xs"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(fieldIndex, { label: e.target.value })}
                    className="text-xs"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select value={field.type} onValueChange={(type) => updateField(fieldIndex, { type: type as ContentField['type'] })}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={field.multilingual || false}
                    onChange={(e) => updateField(fieldIndex, { multilingual: e.target.checked })}
                    className="scale-75"
                  />
                  <Label className="text-xs">Multi-lang</Label>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeField(fieldIndex)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-800 ml-2"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {field.type === 'select' && (
                <div className="mt-2">
                  <Label className="text-xs">Options (comma-separated)</Label>
                  <Input
                    value={field.options?.join(', ') || ''}
                    onChange={(e) => updateField(fieldIndex, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Option1, Option2, Option3"
                    className="text-xs"
                  />
                </div>
              )}
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={addNewField}
            className="w-full text-xs h-8"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add New Field
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 z-10 opacity-80 hover:opacity-100"
            data-testid={`button-edit-content-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Edit {title}</span>
              </div>
              {complexity === 'advanced' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFieldEditor(!showFieldEditor)}
                  className="flex items-center space-x-1 text-xs"
                >
                  <Settings className="w-3 h-3" />
                  <span>Structure</span>
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Advanced Field Editor */}
            {complexity === 'advanced' && showFieldEditor && renderFieldEditor()}
            
            {/* Items List */}
            <div className="space-y-3">
              {editableData.map((item, itemIndex) => (
                <Card key={item.id || itemIndex} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-medium">Item {itemIndex + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(itemIndex)}
                      className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                      data-testid={`button-remove-item-${itemIndex}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editableFields.map(field => renderField(item, itemIndex, field))}
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Add New Item Button */}
            <Button
              variant="outline"
              onClick={addNewItem}
              className="w-full flex items-center space-x-2"
              data-testid="button-add-new-item"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </Button>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                data-testid="button-cancel-content-edit"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                data-testid="button-save-content-edit"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}