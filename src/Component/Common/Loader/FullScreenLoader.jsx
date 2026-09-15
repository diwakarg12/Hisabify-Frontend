import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const FullScreenLoader = ({ show = true, message = "Please wait..." }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/40 animate-fadeIn"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-[var(--surface,#FFFFFF)] dark:bg-[#0F172A] border border-[var(--border,#E2E8F0)] dark:border-[#1E293B] p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 max-w-xs mx-4 text-center transform scale-100 transition-all">
        {/* Brand Teal Spinner */}
        <div className="relative flex items-center justify-center p-2">
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: "#1F7A6C",
            }}
          />
        </div>

        <div className="space-y-1">
          <p className="text-base font-extrabold text-[var(--text-primary,#0F172A)] dark:text-white">
            {message}
          </p>
          <p className="text-xs font-medium text-[var(--text-secondary,#64748B)] dark:text-slate-400">
            Processing your action...
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
