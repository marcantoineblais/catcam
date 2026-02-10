"use client";

import { createContext, useContext } from "react";

type Config = {
  domainName: string;
};

const ConfigContext = createContext<Config>({
  domainName: "",
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
