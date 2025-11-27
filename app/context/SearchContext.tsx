'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <SearchContext.Provider value={{ searchOpen, setSearchOpen }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
