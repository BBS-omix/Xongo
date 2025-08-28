import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { ChartDataPoint } from '@/lib/chartUtils';

interface ChartEditorProps {
  chartType: string;
  title: string;
  data: ChartDataPoint[];
  onSave: (data: ChartDataPoint[], title?: string) => void;
  className?: string;
}

export function ChartEditor({ chartType, title, data, onSave, className }: ChartEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<ChartDataPoint[]>(data);
  const [editableTitle, setEditableTitle] = useState(title);

  const getDataKeys = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const addNewRow = () => {
    const keys = getDataKeys();
    const newRow: ChartDataPoint = {};
    keys.forEach(key => {
      newRow[key] = typeof data[0][key] === 'number' ? 0 : '';
    });
    setEditableData([...editableData, newRow]);
  };

  const removeRow = (index: number) => {
    setEditableData(editableData.filter((_, i) => i !== index));
  };

  const updateValue = (rowIndex: number, key: string, value: string | number) => {
    const updated = [...editableData];
    updated[rowIndex] = { ...updated[rowIndex], [key]: value };
    setEditableData(updated);
  };

  const handleSave = () => {
    onSave(editableData, editableTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableData(data);
    setEditableTitle(title);
    setIsEditing(false);
  };

  const keys = getDataKeys();

  return (
    <div className={`relative ${className}`}>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 z-10 opacity-80 hover:opacity-100"
            data-testid={`button-edit-${chartType}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {chartType} Chart</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Chart Title */}
            <div>
              <Label htmlFor="chart-title">Chart Title</Label>
              <Input
                id="chart-title"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                placeholder="Enter chart title"
                data-testid="input-chart-title"
              />
            </div>

            {/* Data Editor */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Chart Data</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNewRow}
                  className="flex items-center space-x-2"
                  data-testid="button-add-row"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Row</span>
                </Button>
              </div>
              
              <Card className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {keys.map((key) => (
                          <th key={key} className="border p-2 text-left font-semibold bg-gray-50">
                            {key}
                          </th>
                        ))}
                        <th className="border p-2 text-left font-semibold bg-gray-50 w-16">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {editableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {keys.map((key) => (
                            <td key={key} className="border p-2">
                              <Input
                                value={row[key]?.toString() || ''}
                                onChange={(e) => {
                                  const value = typeof data[0][key] === 'number' 
                                    ? parseFloat(e.target.value) || 0
                                    : e.target.value;
                                  updateValue(rowIndex, key, value);
                                }}
                                type={typeof data[0][key] === 'number' ? 'number' : 'text'}
                                className="w-full"
                                data-testid={`input-${key}-${rowIndex}`}
                              />
                            </td>
                          ))}
                          <td className="border p-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRow(rowIndex)}
                              className="text-red-600 hover:text-red-800"
                              data-testid={`button-delete-row-${rowIndex}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                data-testid="button-cancel-edit"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                data-testid="button-save-chart"
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