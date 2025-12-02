import { useContext } from 'react';

import { PropsContext } from './provider';

export const usePropsPassDown = <T>(): T => {
  const context = useContext(PropsContext) as T;
  if (!context) throw new Error('must be used within PropsPassDownProvider');
  return context;
};
