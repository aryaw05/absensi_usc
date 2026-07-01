"use client";

import { useState, type ReactNode } from "react";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PinGuardProps {
  children: ReactNode;
}

export default function PinGuard({ children }: PinGuardProps) {
  const [pin, setPin] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);

  // Check sessionStorage on first render
  useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("scanner_pin_verified");
      if (stored === "true") {
        setVerified(true);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (data.success) {
        setVerified(true);
        sessionStorage.setItem("scanner_pin_verified", "true");
      } else {
        setError(data.message || "PIN salah");
        setPin("");
      }
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-scale-in">
        <Card className="rounded-3xl border-2 border-border bg-card p-8 shadow-hard">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary border-2 border-border flex items-center justify-center mb-4 shadow-hard-sm">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Akses Scanner</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1 text-center">
              Masukkan PIN panitia untuk mengakses scanner QR Code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN"
                className="w-full pl-12 pr-12 py-3 rounded-2xl bg-background border-2 border-border text-foreground placeholder-muted-foreground shadow-hard-sm focus:outline-none focus:translate-y-1 focus:shadow-none transition-all duration-200 text-center text-lg tracking-[0.3em] font-bold"
                autoFocus
                inputMode="numeric"
                maxLength={10}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPin ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-500 font-bold text-sm text-center animate-slide-down">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || !pin}
              variant="brand"
              className="w-full mt-2"
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
