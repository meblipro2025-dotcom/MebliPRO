'use client';

import { useEffect, useRef, useState } from 'react';

type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutosaveOptions<T> {
  value: T;
  onSave: (value: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutosave<T>({ value, onSave, delay = 1500, enabled = true }: UseAutosaveOptions<T>) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousValueRef = useRef<T>(value);

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      return;
    }

    const isSameValue = JSON.stringify(previousValueRef.current) === JSON.stringify(value);
    if (isSameValue) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setStatus('saving');
    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave(value);
        previousValueRef.current = value;
        setStatus('saved');
      } catch (error) {
        setStatus('error');
        console.error('Autosave error:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, onSave, delay, enabled]);

  return { status };
}
