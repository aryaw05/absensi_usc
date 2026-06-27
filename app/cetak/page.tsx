"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import QRCode from "qrcode";
import { useReactToPrint } from "react-to-print";
import { Printer, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Participant {
  id_peserta: string;
  email: string;
  nama_peserta: string;
  asal_sekolah: string;
  alamat?: string;
  no_hp?: string;
}

function IdCard({ participant }: { participant: Participant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        participant.id_peserta,
        {
          width: 120,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "H",
        },
        (error) => {
          if (error) console.error("QR error:", error);
        }
      );
    }
  }, [participant.id_peserta]);

  return (
    <div className="id-card w-[85.6mm] h-[54mm] bg-white rounded-xl border-2 border-border p-3 flex flex-row gap-3 shadow-hard-sm print:shadow-none print:border-slate-300 print:rounded-none">
      {/* Left: QR Code */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <canvas ref={canvasRef} className="block" />
      </div>

      {/* Right: Info */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-1 font-bold">
          {process.env.NEXT_PUBLIC_APP_NAME || "Absensi Lomba"}
        </p>
        <p className="text-sm font-bold text-gray-900 leading-tight truncate">
          {participant.nama_peserta}
        </p>
        {participant.asal_sekolah && (
          <p className="text-[10px] text-gray-700 font-medium mt-0.5 truncate">
            {participant.asal_sekolah}
          </p>
        )}
        {participant.email && (
          <p className="text-[10px] text-neo-black/60 font-medium truncate">
            {participant.email}
          </p>
        )}
        <div className="mt-auto pt-1">
          <p className="text-[9px] font-mono font-bold text-gray-600 bg-gray-100 border-2 border-gray-200 inline-block px-1.5 py-0.5 rounded-md">
            {participant.id_peserta}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CetakPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await fetch("/api/peserta");
      const data = await res.json();
      if (data.success) {
        setParticipants(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "ID Card Peserta",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-brand-purpleDark animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Cetak ID Card
          </h1>
          <p className="text-muted-foreground font-medium mt-1 text-sm">
            Preview dan cetak ID Card untuk {participants.length} peserta
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true);
              fetchParticipants();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-card text-foreground border-2 border-border shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="brand"
            onClick={() => handlePrint()}
            disabled={participants.length === 0}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Cetak Semua
          </Button>
        </div>
      </div>

      {/* Info (hidden in print) */}
      <Card className="no-print rounded-3xl border-2 border-border bg-card p-4 shadow-hard">
        <p className="text-sm font-medium text-muted-foreground">
          💡 ID Card dicetak dalam ukuran standar kartu (85.6 × 54 mm). 
          Pastikan setting printer menggunakan ukuran kertas A4 dan skala 100%.
          QR Code menggunakan error correction level High agar tetap terbaca meski tercetak kurang sempurna.
        </p>
      </Card>

      {/* Cards Grid */}
      {participants.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-bold">
          <p className="text-lg">Belum ada data peserta</p>
        </div>
      ) : (
        <div ref={printRef} className="flex flex-wrap gap-4 justify-center print:p-8">
          {participants.map((p) => (
            <IdCard key={p.id_peserta} participant={p} />
          ))}
        </div>
      )}
    </div>
  );
}
