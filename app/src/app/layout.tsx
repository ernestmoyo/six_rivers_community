import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { InstallPrompt } from "@/components/shared/install-prompt";
import { SwRegister } from "@/components/shared/sw-register";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Six Rivers Community";
const APP_SHORT = "Six Rivers";

export const metadata: Metadata = {
  title: "Six Rivers Community Intelligence",
  description:
    "Community-centered intelligence platform for Six Rivers Africa - tracking farming, nurseries, and conservation impact across southern Tanzania",
  keywords: ["Six Rivers Africa", "community intelligence", "Tanzania", "conservation", "agroforestry"],
  applicationName: APP_NAME,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: APP_SHORT,
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#071637",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script id="sw-register-inline" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function() {});
              });
            }`}
        </Script>
        <SwRegister />
        <InstallPrompt />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
              description: "group-[.toast]:text-muted-foreground",
            },
          }}
        />
      </body>
    </html>
  );
}
