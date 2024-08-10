import React from "react";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-6 shrink h-full w-full max-w-2xl pt-16 px-4 overflow-auto min-h-[100svh]">
      {children}
    </div>
  );
}
