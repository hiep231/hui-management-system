import React, { createContext, ReactNode } from 'react';

type PropsContextType = Record<string, unknown> | null;

type PropsPassDownProviderProps = {
  children: ReactNode;
  value: PropsContextType;
};

export const PropsContext = createContext<PropsContextType>(null);

export const PassDownProps: React.FC<PropsPassDownProviderProps> = ({ children, value }) => {
  return <PropsContext.Provider value={value}>{children}</PropsContext.Provider>;
};
