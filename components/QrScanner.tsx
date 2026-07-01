"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import {
  AlertTriangle,
  Camera,
  CameraOff,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ScanResult {
  success: boolean;
  message: string;
  type: "success" | "already" | "not_found" | "error";
  participant?: {
    id_peserta: string;
    email: string;
    nama_peserta: string;
    asal_sekolah: string;
    alamat: string;
    no_hp: string;
    waktu_absen: string;
    status: string;
  };
}

export default function QrScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (
          state === Html5QrcodeScannerState.SCANNING ||
          state === Html5QrcodeScannerState.PAUSED
        ) {
          await scannerRef.current.stop();
        }
      } catch (e) {
        console.warn("Scanner stop warning:", e);
      }
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const handleScan = useCallback(
    async (decodedText: string) => {
      if (processingRef.current) return;
      processingRef.current = true;
      setProcessing(true);

      try {
        if (scannerRef.current) {
          try {
            await scannerRef.current.pause(true);
          } catch {
            // Scanner might already be paused
          }
        }

        const res = await fetch("/api/absensi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_peserta: decodedText }),
        });

        const data: ScanResult = await res.json();
        setResult(data);

        setTimeout(async () => {
          setResult(null);
          processingRef.current = false;
          if (scannerRef.current) {
            try {
              await scannerRef.current.resume();
            } catch {
              await stopScanner();
            }
          }
        }, 3000);
      } catch (error) {
        console.error("Scan error:", error);
        setResult({
          success: false,
          message: "Gagal menghubungi server",
          type: "error",
        });
        setTimeout(() => {
          setResult(null);
          processingRef.current = false;
          if (scannerRef.current) {
            try {
              scannerRef.current.resume();
            } catch {
              // ignore
            }
          }
        }, 3000);
      } finally {
        setProcessing(false);
      }
    },
    [stopScanner],
  );

  const startScanner = useCallback(async () => {
    if (!containerRef.current) return;

    setResult(null);
    processingRef.current = false;

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        handleScan,
        () => {},
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Camera error:", err);
      setResult({
        success: false,
        message:
          "Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.",
        type: "error",
      });
    }
  }, [handleScan]);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          const state = scannerRef.current.getState();
          if (
            state === Html5QrcodeScannerState.SCANNING ||
            state === Html5QrcodeScannerState.PAUSED
          ) {
            scannerRef.current.stop().then(() => {
              scannerRef.current?.clear();
            });
          } else {
            scannerRef.current.clear();
          }
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const getResultStyle = () => {
    if (!result) return {};
    switch (result.type) {
      case "success":
        return {
          bg: "bg-accent border-2 border-border shadow-hard",
          icon: <CheckCircle2 className="w-10 h-10 text-accent-foreground" />,
          titleColor: "text-accent-foreground",
        };
      case "already":
        return {
          bg: "bg-primary border-2 border-border shadow-hard",
          icon: <AlertTriangle className="w-10 h-10 text-primary-foreground" />,
          titleColor: "text-primary-foreground",
        };
      case "not_found":
        return {
          bg: "bg-brand-pinkVivid border-2 border-border shadow-hard",
          icon: <XCircle className="w-10 h-10 text-foreground" />,
          titleColor: "text-foreground",
        };
      default:
        return {
          bg: "bg-brand-pinkVivid border-2 border-border shadow-hard",
          icon: <XCircle className="w-10 h-10 text-foreground" />,
          titleColor: "text-foreground",
        };
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
      {/* Scanner viewport */}
      <div className="relative w-full aspect-square max-w-sm rounded-3xl overflow-hidden border-2 border-border bg-card shadow-hard">
        <div id="qr-reader" ref={containerRef} className="w-full h-full" />

        {!isScanning && !result && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95">
            <Camera className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-foreground font-bold text-center px-6">
              Tekan tombol di bawah untuk memulai scanner
            </p>
          </div>
        )}

        {processing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-brand-purpleDark animate-spin" />
              <p className="text-foreground font-bold text-sm">Memproses...</p>
            </div>
          </div>
        )}
      </div>

      {/* Scanner controls */}
      <Button
        onClick={isScanning ? stopScanner : startScanner}
        variant={isScanning ? "default" : "brand"}
        size="default"
        className={cn(
          "w-auto px-8 gap-2",
          isScanning &&
            "bg-brand-pinkVivid text-foreground hover:bg-brand-pinkSoft border-2 border-border shadow-hard active:translate-x-[3px] active:translate-y-[4px] active:shadow-none",
        )}
      >
        {isScanning ? (
          <>
            <CameraOff className="w-5 h-5" />
            Stop Scanner
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            Mulai Scanner
          </>
        )}
      </Button>

      {/* Result display */}
      {result && (
        <Card
          className={cn(
            "w-full p-5 animate-scale-in rounded-3xl",
            getResultStyle().bg,
          )}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">{getResultStyle().icon}</div>
            <div className="flex-1 min-w-0">
              <p
                className={cn("font-bold text-lg", getResultStyle().titleColor)}
              >
                {result.type === "success"
                  ? "Berhasil!"
                  : result.type === "already"
                    ? "Sudah Absen"
                    : result.type === "not_found"
                      ? "Tidak Terdaftar"
                      : "Error"}
              </p>
              <p className="text-foreground font-medium text-sm mt-1">
                {result.message}
              </p>

              {result.participant && (
                <div className="mt-3 space-y-1">
                  <p className="text-foreground font-bold">
                    {result.participant.nama_peserta}
                  </p>
                  {result.participant.asal_sekolah && (
                    <p className="text-foreground/80 font-medium text-sm">
                      {result.participant.asal_sekolah}
                    </p>
                  )}
                  {result.participant.no_hp && (
                    <p className="text-foreground/70 font-medium text-sm">
                      📞 {result.participant.no_hp}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
