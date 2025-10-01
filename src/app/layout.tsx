import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import QuickActions from "@/components/QuickActions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketing Agency CRM",
  description: "Comprehensive CRM system for marketing agencies",
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
        <DataProvider>
          <div className="relative min-h-screen">
            <Sidebar />
            <Topbar />
            <main className="relative z-0 ml-64 mt-16 p-8 min-h-screen">
              {children}
            </main>
            <QuickActions />
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
