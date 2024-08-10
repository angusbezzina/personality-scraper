"use client";

import React from "react";

export interface WindowState {
  [key: string]: React.ReactNode;
}

export interface WindowsContext {
  setWindows: React.Dispatch<React.SetStateAction<WindowState>>;
}

export const WindowsContext = React.createContext<WindowsContext>({
  setWindows: () => ({}),
});

export const useWindows = () => React.useContext(WindowsContext);
