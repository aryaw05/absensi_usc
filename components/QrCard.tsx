"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QrCardProps {
  id_peserta: string;
  email?: string;
  nama_peserta: string;
  asal_sekolah?: string;
  alamat?: string;
  no_hp?: string;
  waktu_absen?: string;
  status?: string;
}

export default function QrCard({
  id_peserta,
  email,
  nama_peserta,
  asal_sekolah,
}: QrCardProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(id_peserta, {
      width: 400,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then(setDataUrl).catch(err => console.error("QR error:", err));
  }, [id_peserta]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qr-${id_peserta}.png`;
    link.click();
  };

  return (
    <Card className="group rounded-3xl border-2 border-border bg-card p-3 sm:p-4 transition-all duration-300 shadow-hard hover:translate-x-[3px] hover:translate-y-[4px] hover:shadow-none flex flex-col h-full">
      <div className="flex flex-col items-center flex-grow">
        {/* QR Code */}
        <div className="bg-white rounded-2xl border-2 border-border p-2 sm:p-3 mb-3 shadow-hard-sm w-full max-w-[140px] sm:max-w-[180px] aspect-square flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-105">
          {dataUrl ? (
            <img src={dataUrl} alt={`QR ${id_peserta}`} className="w-full h-auto block rounded-xl object-contain" />
          ) : (
            <div className="w-full h-full bg-muted animate-pulse rounded-xl"></div>
          )}
        </div>

        {/* Info */}
        <div className="text-center mb-3 w-full">
          <p className="text-xs font-mono font-bold text-muted-foreground mb-1">{id_peserta}</p>
          <p className="text-sm font-bold text-foreground truncate">
            {nama_peserta}
          </p>
          {asal_sekolah && (
            <p className="text-xs font-medium text-foreground/80 truncate">{asal_sekolah}</p>
          )}
          {email && (
            <p className="text-xs font-medium text-foreground/60 mt-0.5 truncate">{email}</p>
          )}
        </div>

        {/* Download button */}
        <Button
          onClick={handleDownload}
          variant="brand"
          size="sm"
          className="w-full gap-1.5"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    </Card>
  );
}
