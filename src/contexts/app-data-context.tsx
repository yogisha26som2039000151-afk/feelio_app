import { createContext, ReactNode, useContext } from 'react';

import { useAppData } from '@/hooks/use-app-data';

type AppDataContextType = ReturnType<typeof useAppData>;

const AppDataContext = createContext<AppDataContextType | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const appData = useAppData();
  return <AppDataContext.Provider value={appData}>{children}</AppDataContext.Provider>;
}

export function useAppDataContext() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppDataContext must be used within AppDataProvider');
  return ctx;
}
