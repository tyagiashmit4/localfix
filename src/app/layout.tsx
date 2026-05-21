import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalFix | Trusted Local Services Marketplace",
  description: "Find trusted local service providers such as electricians, plumbers, tutors, AC repair technicians, and home cleaning services in Tier 2 and Tier 3 cities.",
};

import NavigationWrapper from "../components/common/NavigationWrapper";
import AuthProvider from "../components/common/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-500 selection:text-white`}
      >
        <AuthProvider>
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
