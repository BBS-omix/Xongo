import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'tr';
export type Complexity = 'basic' | 'advanced';
export type CreatorMode = boolean;

interface PresentationContextType {
  language: Language;
  complexity: Complexity;
  creatorMode: CreatorMode;
  setLanguage: (language: Language) => void;
  setComplexity: (complexity: Complexity) => void;
  setCreatorMode: (mode: CreatorMode) => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export function usePresentationContext() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentationContext must be used within a PresentationProvider');
  }
  return context;
}

interface PresentationProviderProps {
  children: React.ReactNode;
}

export function PresentationProvider({ children }: PresentationProviderProps) {
  const [language, setLanguage] = useState<Language>('tr');
  const [complexity, setComplexity] = useState<Complexity>('advanced');
  const [creatorMode, setCreatorMode] = useState<CreatorMode>(false);

  return (
    <PresentationContext.Provider
      value={{
        language,
        complexity,
        creatorMode,
        setLanguage,
        setComplexity,
        setCreatorMode,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
}
