import InstallPrompt from "@/components/InstallPrompt";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Archivo_Black, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// const syne = Syne({
//   subsets: ["latin"],
//   weight: ["800"],
//   variable: "--font-display",
// });

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Absensi Lomba";

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    "Sistem absensi peserta lomba menggunakan QR Code. Scan QR Code untuk registrasi cepat dan akurat.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: appName,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F9F5F2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={cn("font-sans", archivo.variable, plusJakartaSans.variable)}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <Navbar />
        <main className="relative z-10 pt-4 pb-24 md:pt-20 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
          {children}
        </main>

        <InstallPrompt />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered:', reg.scope); })
                    .catch(function(err) { console.log('SW registration failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
