"use client";

import { WindowsContextProvider } from "@personality-scraper/components";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <WindowsContextProvider>{children}</WindowsContextProvider>
      <div id="modal-portal" tabIndex={-1} />
    </>
  );
}
