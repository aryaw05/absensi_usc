"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Check if app is already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone;

    if (isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      if (sessionStorage.getItem("installPromptShown")) return;
      
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowPrompt(true);
      sessionStorage.setItem("installPromptShown", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If it's iOS and not standalone, show the custom iOS prompt
    // because iOS doesn't support the beforeinstallprompt event
    if (isIosDevice && !isStandalone) {
      const hasDismissed = localStorage.getItem("iosInstallDismissed");
      if (!hasDismissed && !sessionStorage.getItem("installPromptShown")) {
        setShowPrompt(true);
        sessionStorage.setItem("installPromptShown", "true");
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem("iosInstallDismissed", "true");
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-[9999] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-hard flex items-center gap-4 max-w-sm ml-auto relative overflow-hidden">
        
        <div className="bg-primary p-3 rounded-xl shrink-0 border-2 border-border shadow-hard-sm">
          <Download className="w-6 h-6 text-primary-foreground" />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-foreground font-bold text-sm">Install Aplikasi</h3>
          {isIOS ? (
            <p className="text-muted-foreground font-medium text-xs mt-1 leading-snug">
              Tap ikon <span className="inline-block bg-muted px-1.5 py-0.5 rounded border border-border text-foreground font-bold">Share</span> di bawah, lalu pilih <b>Add to Home Screen</b>.
            </p>
          ) : (
            <p className="text-muted-foreground font-medium text-xs mt-1 leading-snug">
              Install aplikasi ini di layar utama untuk akses instan.
            </p>
          )}
        </div>

        {!isIOS && (
          <Button
            onClick={handleInstallClick}
            variant="brand"
            size="sm"
            className="shrink-0"
          >
            Install
          </Button>
        )}

        <button
          onClick={dismissPrompt}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-1 bg-muted border-2 border-transparent hover:border-border hover:shadow-hard-sm rounded-full transition-all"
          aria-label="Tutup"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
