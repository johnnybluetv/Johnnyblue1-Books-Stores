import React, { useState, useEffect } from 'react';
import { 
  X, 
  Folder, 
  FolderPlus, 
  Check, 
  Trash2, 
  Tag 
} from 'lucide-react';
import { CollectionFolder } from '../types';

interface CollectionFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderToEdit?: CollectionFolder | null;
  onSave: (name: string, color: string, description: string) => void;
  onDelete?: (folderId: string) => void;
}

const COLOR_OPTIONS: { id: string; label: string; bgClass: string; ringClass: string }[] = [
  { id: 'amber', label: 'Amber Gold', bgClass: 'bg-amber-500', ringClass: 'ring-amber-500' },
  { id: 'emerald', label: 'Emerald Forest', bgClass: 'bg-emerald-500', ringClass: 'ring-emerald-500' },
  { id: 'purple', label: 'Royal Amethyst', bgClass: 'bg-purple-500', ringClass: 'ring-purple-500' },
  { id: 'indigo', label: 'Deep Indigo', bgClass: 'bg-indigo-500', ringClass: 'ring-indigo-500' },
  { id: 'rose', label: 'Crimson Rose', bgClass: 'bg-rose-500', ringClass: 'ring-rose-500' },
  { id: 'teal', label: 'Pacific Teal', bgClass: 'bg-teal-500', ringClass: 'ring-teal-500' },
  { id: 'sky', label: 'Sky Azure', bgClass: 'bg-sky-500', ringClass: 'ring-sky-500' },
  { id: 'stone', label: 'Warm Slate', bgClass: 'bg-stone-500', ringClass: 'ring-stone-500' }
];

export const CollectionFolderModal: React.FC<CollectionFolderModalProps> = ({
  isOpen,
  onClose,
  folderToEdit,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('amber');

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setDescription(folderToEdit.description || '');
      setSelectedColor(folderToEdit.color || 'amber');
    } else {
      setName('');
      setDescription('');
      setSelectedColor('amber');
    }
  }, [folderToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), selectedColor, description.trim());
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              {folderToEdit ? <Folder className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                {folderToEdit ? 'Edit Collection Folder' : 'Create Collection Folder'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Organize your purchased editions into custom digital shelves
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Folder Name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Masterclass Series, Daily Study, Sci-Fi..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief note or goal for this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-amber-500 outline-none transition"
            />
          </div>

          {/* Color Swatches */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              <span>Color Tag Accent</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((col) => {
                const isSelected = selectedColor === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-100 dark:bg-stone-800'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${col.bgClass} shrink-0`} />
                    <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300 truncate">
                      {col.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            {folderToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete folder "${folderToEdit.name}"? (Books will remain in your library)`)) {
                    onDelete(folderToEdit.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition flex items-center gap-1.5 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{folderToEdit ? 'Save Changes' : 'Create Folder'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
