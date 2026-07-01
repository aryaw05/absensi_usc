"use client";

import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  totalPeserta: number;
  totalHadir: number;
  totalBelumHadir: number;
  persentaseKehadiran: number;
  loading?: boolean;
}

const statCards = [
  {
    key: "total",
    label: "Total Peserta",
    icon: Users,
    bgIcon: "bg-primary text-primary-foreground",
    field: "totalPeserta" as const,
  },
  {
    key: "hadir",
    label: "Hadir",
    icon: UserCheck,
    bgIcon: "bg-accent text-accent-foreground",
    field: "totalHadir" as const,
  },
  {
    key: "belum",
    label: "Belum Hadir",
    icon: UserX,
    bgIcon: "bg-brand-pinkVivid text-foreground",
    field: "totalBelumHadir" as const,
  },
  {
    key: "persen",
    label: "Kehadiran",
    icon: TrendingUp,
    bgIcon: "bg-brand-pinkSoft text-foreground",
    field: "persentaseKehadiran" as const,
  },
];

export default function DashboardStats({
  totalPeserta,
  totalHadir,
  totalBelumHadir,
  persentaseKehadiran,
  loading,
}: DashboardStatsProps) {
  const values = { totalPeserta, totalHadir, totalBelumHadir, persentaseKehadiran };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card
          key={card.key}
          className="group relative overflow-hidden rounded-3xl border-2 border-border bg-card p-5 transition-all duration-300 shadow-hard animate-slide-up hover:translate-x-[3px] hover:translate-y-[4px] hover:shadow-none"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
        >
          <div className="relative">
            <div
              className={cn(
                "inline-flex items-center justify-center w-10 h-10 rounded-2xl border-2 border-border shadow-hard-sm mb-3",
                card.bgIcon
              )}
            >
              <card.icon className="w-5 h-5" />
            </div>

            <p className="text-sm font-bold text-muted-foreground mb-1">{card.label}</p>

            {loading ? (
              <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
            ) : (
              <p className="text-2xl lg:text-3xl font-bold text-foreground">
                {values[card.field]}
                {card.field === "persentaseKehadiran" && (
                  <span className="text-lg text-muted-foreground ml-0.5">%</span>
                )}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
