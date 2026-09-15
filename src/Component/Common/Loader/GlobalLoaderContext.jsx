import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import FullScreenLoader from "./FullScreenLoader";

const GlobalLoaderContext = createContext({
  showLoader: (msg) => {},
  hideLoader: () => {},
  startAsyncAction: async (asyncFn, msg) => {},
});

export const useGlobalLoader = () => useContext(GlobalLoaderContext);

export const GlobalLoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Please wait...");
  const activeRequestsRef = useRef(0);
  const safetyTimerRef = useRef(null);

  const showLoader = (msg = "Please wait...") => {
    activeRequestsRef.current += 1;
    setLoadingMessage(msg);
    setLoading(true);

    // Auto-dismiss safety timeout: Prevents loader from ever getting stuck permanently
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = setTimeout(() => {
      activeRequestsRef.current = 0;
      setLoading(false);
    }, 8000);
  };

  const hideLoader = () => {
    activeRequestsRef.current = Math.max(0, activeRequestsRef.current - 1);
    if (activeRequestsRef.current === 0) {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      setLoading(false);
    }
  };

  const startAsyncAction = async (asyncFn, msg) => {
    showLoader(msg);
    try {
      return await asyncFn();
    } finally {
      hideLoader();
    }
  };

  // Global window.fetch interceptor
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const [resource, config] = args;
      const headers = config?.headers || {};

      const getHeaderVal = (h, key) => {
        if (!h) return null;
        if (typeof h.get === "function") return h.get(key) || h.get(key.toLowerCase());
        return h[key] || h[key.toLowerCase()] || h[key.toUpperCase()];
      };

      // Check if this request is marked as a background poll
      const isBackground =
        getHeaderVal(headers, "x-background-sync") === "true" ||
        (typeof resource === "string" &&
          (resource.includes("/notification/getAll") ||
            resource.includes("x-background-sync") ||
            resource.includes("isBackground=true")));

      if (!isBackground) {
        showLoader();
      }

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        if (!isBackground) {
          hideLoader();
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <GlobalLoaderContext.Provider value={{ showLoader, hideLoader, startAsyncAction }}>
      {children}
      <FullScreenLoader show={loading} message={loadingMessage} />
    </GlobalLoaderContext.Provider>
  );
};

export default GlobalLoaderProvider;
