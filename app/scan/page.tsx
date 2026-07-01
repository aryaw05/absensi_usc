"use client";

import PinGuard from "@/components/PinGuard";
import QrScanner from "@/components/QrScanner";
import { ScanLine } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ScanPage() {
  return (
    <PinGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <ScanLine className="w-6 h-6 text-brand-purpleDark" />
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-foreground">
              Scan Absensi
            </h1>
          </div>
          <p className="text-muted-foreground font-medium text-sm">
            Arahkan kamera ke QR Code peserta untuk melakukan absensi
          </p>
        </div>

        {/* Scanner */}
        <QrScanner />

        {/* Tips */}
        <Card className="max-w-lg mx-auto rounded-3xl border-2 border-border bg-card p-5 shadow-hard">
          <h3 className="text-sm font-bold text-foreground mb-3">
            💡 Tips Scanning
          </h3>
          <ul className="space-y-2 text-sm font-medium text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-brand-purpleDark mt-0.5">•</span>
              Pastikan QR Code terlihat jelas dan tidak terlipat
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-purpleDark mt-0.5">•</span>
              Jaga jarak kamera 15-25 cm dari QR Code
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-purpleDark mt-0.5">•</span>
              Pastikan pencahayaan cukup, hindari backlight
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-purpleDark mt-0.5">•</span>
              Scanner akan otomatis melanjutkan setelah 3 detik
            </li>
          </ul>
        </Card>
      </div>
    </PinGuard>
  );
}
