import React, { useState } from 'react';
import { 
  X, 
  Folder, 
  FolderPlus, 
  Check, 
  CheckCircle2, 
  FolderCheck,
  FolderMinus
} from 'lucide-react';
import { LibraryItem, CollectionFolder } from '../types';

interface AssignFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LibraryItem | null;
  folders: CollectionFolder[];
  onAssign: (itemId: string, folderId: string | null) => void;
  onCreateFolderClick: () => void;
}

export const AssignFolderModal: React.FC<AssignFolderModalProps> = ({
  isOpen,
  onClose,
  item,
  folders,
  onAssign,
  onCreateFolderClick
}) => {
  if (!isOpen || !item) return null;

  const colorClasses: Record<string, string> = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    rose: 'bg-rose-500',
    teal: 'bg-teal-500',
    sky: 'bg-sky-500',
    stone: 'bg-stone-500'
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
            <img
              src={item.book.coverImage}
              alt={item.book.title}
              className="w-10 h-14 object-cover rounded-md shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 truncate">
                Organize Edition
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                {item.book.title} ({item.format})
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

        {/* Folder List */}
        <div className="p-5 space-y-2 max-h-80 overflow-y-auto">
          <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
            Select Collection Folder
          </div>

          {/* Remove / Unassigned Option */}
          <button
            onClick={() => {
              onAssign(item.id, null);
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer text-left text-xs ${
              !item.folderId
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-stone-900 dark:text-stone-100 font-bold'
                : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <FolderMinus className="w-3.5 h-3.5" />
              </div>
              <div>
                <div>Unassigned (Default Shelf)</div>
                <div className="text-[10px] text-stone-400 font-normal">Not organized into any specific collection folder</div>
              </div>
            </div>
            {!item.folderId && (
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            )}
          </button>

          {/* Existing Folders */}
          {folders.map((folder) => {
            const isCurrent = item.folderId === folder.id;
            const dotColor = colorClasses[folder.color] || 'bg-amber-500';
            return (
              <button
                key={folder.id}
                onClick={() => {
                  onAssign(item.id, folder.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer text-left text-xs ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{folder.name}</div>
                    {folder.description && (
                      <div className="text-[10px] text-stone-400 truncate font-normal">
                        {folder.description}
                      </div>
                    )}
                  </div>
                </div>
                {isCurrent && (
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer with Create Folder shortcut */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onCreateFolderClick();
            }}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1.5 transition cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Create New Folder</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
