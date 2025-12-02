import "@/css/app.scss";
import "@/css/tailwind.scss";
import "zmp-ui/zaui.css";

import { AppProviders } from "@/providers";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import router from "@/router";
import appConfig from "../app-config.json";
import GlobalDataSyncer from "./components/features/GlobalDataSyncer";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig as any;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const root = createRoot(document.getElementById("app")!);

root.render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      {/* <AppProviders> */}
      <RecoilNexus />
      <GlobalDataSyncer />
      <RouterProvider router={router} />
      {/* </AppProviders> */}
    </RecoilRoot>
  </QueryClientProvider>
);
