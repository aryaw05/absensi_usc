"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface AttendanceRecord {
  nama_peserta: string;
  asal_sekolah: string;
  waktu_absen: string;
  status: string;
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
  loading?: boolean;
  maxRows?: number;
}

export default function AttendanceTable({
  data,
  loading,
  maxRows,
}: AttendanceTableProps) {
  const displayData = maxRows
    ? data.slice(-maxRows).reverse()
    : [...data].reverse();

  if (loading) {
    return (
      <Card className="rounded-3xl border-2 border-border bg-card overflow-hidden shadow-hard">
        <div className="p-5 border-b-2 border-border">
          <div className="h-6 w-48 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-muted/50 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-2 border-border bg-card overflow-hidden shadow-hard animate-fade-in">
      <div className="p-5 border-b-2 border-border flex items-center gap-2 bg-muted/20">
        <Clock className="w-5 h-5 text-brand-purpleDark" />
        <h3 className="text-lg font-bold text-foreground">Absensi Terbaru</h3>
        <span className="ml-auto text-sm font-semibold text-muted-foreground">
          {data.length} data
        </span>
      </div>

      {displayData.length === 0 ? (
        <div className="p-10 text-center text-muted-foreground">
          <p className="text-lg font-bold text-foreground">
            Belum ada data absensi
          </p>
          <p className="text-sm mt-1">
            Scan QR Code peserta untuk memulai absensi
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted/10">
                <th className="text-left py-3 px-5 text-muted-foreground font-bold">
                  Nama
                </th>
                <th className="text-left py-3 px-5 text-muted-foreground font-bold">
                  Nama
                </th>
                <th className="text-left py-3 px-5 text-muted-foreground font-bold hidden sm:table-cell">
                  Waktu
                </th>
                <th className="text-left py-3 px-5 text-muted-foreground font-bold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((record, index) => (
                <tr
                  key={`${record.id_peserta}-${index}`}
                  className="border-b-2 border-border last:border-0 hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="py-3 px-5 text-foreground font-bold">
                    {record.nama_peserta}
                  </td>
                  <td className="py-3 px-5 text-foreground font-bold">
                    {record.asal_sekolah}
                  </td>
                  <td className="py-3 px-5 text-muted-foreground font-medium hidden sm:table-cell">
                    {record.waktu_absen}
                  </td>
                  <td className="py-3 px-5">
                    <Badge
                      variant="outline"
                      className="bg-accent text-accent-foreground border-2 border-border font-bold text-xs shadow-hard-sm"
                    >
                      {record.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
