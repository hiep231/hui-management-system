import { useContext } from 'react';

import { BottomSheetContext } from '@/providers/bottomSheet/provider';

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) throw new Error('useBottomSheetContext must be used within SheetProvider');
  return ctx;
};
