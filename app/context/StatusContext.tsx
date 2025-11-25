'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface StatusState {
  mode: string; // NORMAL, INSERT, VISUAL, etc.
  filename: string;
  fileType: string;
  isModified: boolean;
  encoding: string;
  percentage: string;
  statusMessage: string;
}

interface StatusContextType {
  status: StatusState;
  setStatus: (status: Partial<StatusState>) => void;
  resetStatus: () => void;
}

const DEFAULT_STATUS: StatusState = {
  mode: 'NORMAL',
  filename: 'portfolio.tsx',
  fileType: 'typescript',
  isModified: true, // The [+] effect
  encoding: 'utf-8',
  percentage: '100%',
  statusMessage: 'ONLINE'
};

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export function StatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatusState] = useState<StatusState>(DEFAULT_STATUS);

  const setStatus = useCallback((newStatus: Partial<StatusState>) => {
    setStatusState(prev => {
      // Deep comparison to prevent update if values haven't changed
      const hasChanged = Object.entries(newStatus).some(
        ([key, value]) => prev[key as keyof StatusState] !== value
      );
      
      if (!hasChanged) return prev;
      return { ...prev, ...newStatus };
    });
  }, []);

  const resetStatus = useCallback(() => {
    setStatusState(DEFAULT_STATUS);
  }, []);

  return (
    <StatusContext.Provider value={{ status, setStatus, resetStatus }}>
      {children}
    </StatusContext.Provider>
  );
}

export function useStatus() {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
}
