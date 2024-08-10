"use client";

import React from "react";

import { WindowsContext, type WindowState } from "./context";

interface WindowsContextProviderProps {
  children: React.ReactNode;
}

export const WindowsContextProvider = ({ children }: WindowsContextProviderProps) => {
  const [windows, setWindows] = React.useState<WindowState>({});

  const contextValue = React.useMemo(
    () =>
      ({
        setWindows,
      }) as WindowsContext,
    [setWindows],
  );

  const windowComponents = Object.entries(windows).map(([id, win]) => (
    <React.Fragment key={id}>{win}</React.Fragment>
  ));

  return (
    <WindowsContext.Provider value={contextValue}>
      <>
        {children}
        {windowComponents}
      </>
    </WindowsContext.Provider>
  );
};
