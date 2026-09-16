import React, { useState, useEffect } from 'react';
import { FaDownload, FaTimes, FaShareSquare } from 'react-icons/fa';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

    if (isStandalone) {
      setShowPrompt(false);
      return;
    }

    if (iosDevice) {
      setIsIOS(true);
      setShowPrompt(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent automatic browser banner
      e.preventDefault();
      // Store event for trigger
      setDeferredPrompt(e);
      // Show custom install UI
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 animate-slideUp">
      <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-4 shadow-[var(--shadow-floating)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand)] text-white flex items-center justify-center shrink-0 shadow-md">
            <img src="/logo-dark.png" alt="HisabiFY Icon" className="w-8 h-8 rounded-lg object-contain" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">Install HisabiFY App</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {isIOS
                ? "Tap Share ↗ and 'Add to Home Screen'"
                : 'Get quick access from your home screen'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <FaDownload className="w-3 h-3" /> Install
            </button>
          )}
          {isIOS && (
            <span className="px-2.5 py-1 bg-[var(--brand-light)] text-[var(--brand)] text-[11px] font-bold rounded-lg flex items-center gap-1">
              <FaShareSquare className="w-3 h-3" /> Share
            </span>
          )}
          <button
            onClick={() => setShowPrompt(false)}
            className="w-7 h-7 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)] flex items-center justify-center transition-colors"
            aria-label="Dismiss"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

