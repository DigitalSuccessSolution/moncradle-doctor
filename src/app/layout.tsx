import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import QuickAddModal from "@/components/QuickAddModal";
import EnterToNextField from "@/components/EnterToNextField";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MONCRADLE - Doctor Portal",
  description: "Pediatric Growth Tracking, Nutrition & Clinical Portal for Doctors",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MONCRADLE Doctor",
  },
};

export const viewport: Viewport = {
  themeColor: "#A5D8FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { DoctorDataProvider } from "@/context/DoctorDataContext";
import AppShell from "@/components/AppShell";
import OfflineIndicator from "@/components/OfflineIndicator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#F8F9FA] text-slate-800 antialiased selection:bg-[#A5D8FF]" suppressHydrationWarning>
        <DoctorDataProvider>
          <EnterToNextField />
          <OfflineIndicator />
          <AppShell>{children}</AppShell>
        </DoctorDataProvider>
      </body>
    </html>
  );
}
