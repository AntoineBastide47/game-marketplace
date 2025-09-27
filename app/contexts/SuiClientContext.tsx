'use client'
import React, { createContext, useContext } from 'react';
import { SuiClient } from '@mysten/sui/client';
import { useNetworkVariable } from '@/networkConfig';

const SuiClientContext = createContext<SuiClient | undefined>(undefined);

export function SuiClientProvider({ children }: { children: React.ReactNode }) {
  const nodeUrl = useNetworkVariable("nodeUrl");
  const client = new SuiClient({ url: nodeUrl });

  return (
    <SuiClientContext.Provider value={client}>
      {children}
    </SuiClientContext.Provider>
  );
}

export function useSuiClient() {
  const context = useContext(SuiClientContext);
  if (context === undefined) {
    throw new Error('useSuiClient must be used within a SuiClientProvider');
  }
  return context;
}