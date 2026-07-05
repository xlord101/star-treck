import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import CreateShipmentModal from "@/components/CreateShipmentModal";
import AppInitializer from "@/components/AppInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Freightnaut - Advanced Logistics & Export Management",
  description: "Enterprise SaaS for managing shipments, docs, inventory, and tracking with AI parsing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-slate-50 text-slate-900 font-sans">
        <AppInitializer>
          {/* Main Layout Container */}
          <div className="flex w-full min-h-screen">
            {/* Sidebar (Left) */}
            <Sidebar />

            {/* Content Area (Right) */}
            <div className="flex-1 flex flex-col min-w-0">
              <Topbar />
              
              <main className="flex-1 p-6 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>

          {/* Global Modals */}
          <CreateShipmentModal />
        </AppInitializer>
      </body>
    </html>
  );
}
