import { Suspense } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { THandle } from "@/router";
import { SnackbarProvider } from "zmp-ui";
import { AppProviders } from "@/providers";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  const matches = useMatches();
  const handle = matches[matches.length - 1]?.handle as THandle;
  const showBottom = !handle?.disbledBottom;

  return (
    <AppProviders>
      <Suspense fallback={<></>}>
        <SnackbarProvider>
          <Outlet />
        </SnackbarProvider>
      </Suspense>
      {showBottom && <BottomNav />}
    </AppProviders>
  );
}
