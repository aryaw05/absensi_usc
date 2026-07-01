"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ScanLine,
  Printer,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/peserta", label: "Peserta", icon: Users },
  { href: "/scan", label: "Scan", icon: ScanLine },
  { href: "/cetak", label: "Cetak", icon: Printer },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center px-6 border-b-2 border-border bg-background">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <div className="w-9 h-9 rounded-full border-2 border-border bg-primary flex items-center justify-center shadow-hard-sm">
            <QrCode className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            {process.env.NEXT_PUBLIC_APP_NAME || "Absensi Lomba"}
          </span>
        </Link>
        <div className="flex gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-[15px] font-semibold transition-all duration-200 border-2",
                  isActive
                    ? "bg-accent text-accent-foreground border-border shadow-hard"
                    : "text-foreground border-transparent hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border bg-background safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-xl border-2 transition-all duration-200",
                    isActive ? "bg-accent border-border shadow-hard-sm" : "border-transparent"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
