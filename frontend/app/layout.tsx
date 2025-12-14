import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import ClientProviders from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientProviders>
          <Navigation />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
