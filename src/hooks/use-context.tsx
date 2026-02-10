import React, { createContext, useContext, useMemo } from "react";
import { SERVER_URL } from "../config";

type Config = {
  domainName: string;
};

const ConfigContext = createContext<Config>({ domainName: "" });

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const config = useMemo(() => ({
    domainName: SERVER_URL,
  }), []);

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
