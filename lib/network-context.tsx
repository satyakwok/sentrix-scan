"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import type { NetworkId } from "./chain";

interface NetworkContextValue {
  network: NetworkId;
  setNetwork: (n: NetworkId) => void;
  toggle: () => void;
}

const NetworkContext = createContext<NetworkContextValue>({
  network: "mainnet",
  setNetwork: () => {},
  toggle: () => {},
});

// DECISION: always start at "mainnet" for the first paint so SSR ↔ CSR agree; hydrate the
// localStorage value in a useEffect AFTER mount. Reading localStorage in useState initializer
// produced different initial state on server (always mainnet) vs client (could be testnet)
// → React error #418 "hydration failed" on every page load for users with testnet preference.
export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkId>("mainnet");

  useEffect(() => {
    const stored = (typeof window !== "undefined" ? localStorage.getItem("sentrix-network") : null) as NetworkId | null;
    if (stored && stored !== network) setNetwork(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSet = useCallback((n: NetworkId) => {
    setNetwork(n);
    if (typeof window !== "undefined") localStorage.setItem("sentrix-network", n);
    toast.success(`Switched to ${n === "mainnet" ? "Mainnet (Chain ID 7119)" : "Testnet (Chain ID 7120)"}`);
  }, []);

  const toggle = useCallback(() => {
    handleSet(network === "mainnet" ? "testnet" : "mainnet");
  }, [network, handleSet]);

  return (
    <NetworkContext.Provider value={{ network, setNetwork: handleSet, toggle }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
