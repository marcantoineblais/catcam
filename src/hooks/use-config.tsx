"use client";

import { createContext, useContext } from "react";

type Config = {
  domainName: string;
  autoDarkModeTime: { start: number; end: number };
};

const ConfigContext = createContext<Config>({
  domainName: "",
  autoDarkModeTime: { start: 0, end: 0 },
});

export function ConfigProvider({
  config,
  children,
}: {
  config: Config;
  children: React.ReactNode;
}) {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
