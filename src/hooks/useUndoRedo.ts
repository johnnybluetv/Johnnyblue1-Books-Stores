import { useState, useCallback, useEffect, useRef } from 'react';

export interface HistoryItem<T> {
  id: string;
  timestamp: number;
  label: string;
  state: T;
}

export interface UseUndoRedoReturn<T> {
  state: T;
  set: (updater: T | ((prev: T) => T), label?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: HistoryItem<T>[];
  currentIndex: number;
  jumpTo: (index: number) => void;
  lastAction: string | null;
  reset: (newInitialState: T, label?: string) => void;
}

export function useUndoRedo<T>(
  initialState: T,
  initialLabel = 'Initial Document'
): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<HistoryItem<T>[]>([
    {
      id: `h_${Date.now()}_0`,
      timestamp: Date.now(),
      label: initialLabel,
      state: initialState
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const isInternalChangeRef = useRef(false);

  const currentState = history[currentIndex]?.state ?? initialState;

  const set = useCallback((updater: T | ((prev: T) => T), label = 'Edit') => {
    setHistory((prevHistory) => {
      const current = prevHistory[currentIndex]?.state;
      const nextState = typeof updater === 'function' 
        ? (updater as (prev: T) => T)(current)
        : updater;

      // Slice out any redo future if we branched from a middle step
      const updatedHistory = prevHistory.slice(0, currentIndex + 1);

      // Limit max history stack to 50 to conserve memory
      if (updatedHistory.length >= 50) {
        updatedHistory.shift();
      }

      const newItem: HistoryItem<T> = {
        id: `h_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: Date.now(),
        label,
        state: nextState
      };

      return [...updatedHistory, newItem];
    });

    setCurrentIndex((prev) => {
      const maxIndex = Math.min(prev + 1, 49);
      return maxIndex;
    });

    setLastAction(label);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isInternalChangeRef.current = true;
      const targetIndex = currentIndex - 1;
      setCurrentIndex(targetIndex);
      setLastAction(`Undo: ${history[currentIndex]?.label || 'Change'}`);
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isInternalChangeRef.current = true;
      const targetIndex = currentIndex + 1;
      setCurrentIndex(targetIndex);
      setLastAction(`Redo: ${history[targetIndex]?.label || 'Change'}`);
    }
  }, [currentIndex, history]);

  const jumpTo = useCallback((index: number) => {
    if (index >= 0 && index < history.length) {
      isInternalChangeRef.current = true;
      setCurrentIndex(index);
      setLastAction(`Jump to: ${history[index].label}`);
    }
  }, [history]);

  const reset = useCallback((newInitialState: T, label = 'Reset Document') => {
    setHistory([
      {
        id: `h_${Date.now()}_0`,
        timestamp: Date.now(),
        label,
        state: newInitialState
      }
    ]);
    setCurrentIndex(0);
    setLastAction(label);
  }, []);

  // Global keyboard listener for Ctrl+Z / Cmd+Z and Ctrl+Y / Cmd+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is actively in a standard text input or textarea
      // If so, native browser undo usually handles character typing;
      // but if user presses Cmd+Shift+Z or has no active input, or explicitly wants form undo:
      const target = e.target as HTMLElement | null;
      const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isUndo = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey;
      const isRedo = 
        ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'z' && e.shiftKey) ||
        ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'y');

      if (isUndo && !isTyping) {
        e.preventDefault();
        undo();
      } else if (isRedo && !isTyping) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    state: currentState,
    set,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    history,
    currentIndex,
    jumpTo,
    lastAction,
    reset
  };
}
