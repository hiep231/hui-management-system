import { BottomSheetProvider } from "@/providers/bottomSheet/provider";

import { PopupProvider } from "./popup/provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BottomSheetProvider defaultOptions={{ zIndex: 1000 }}>
      <PopupProvider>
        {/* <Suspense fallback={<LoadingInitApp key="skeleton" />}>{children}</Suspense> */}
        {children}
      </PopupProvider>
    </BottomSheetProvider>
  );
};
