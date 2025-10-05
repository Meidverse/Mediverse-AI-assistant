import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSans = IBM_Plex_Sans({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"], 
  variable: "--font-ibm-plex" 
});

export const metadata: Metadata = {
  title: "Mediverse | Clinical AI operating layer",
  description:
    "Mediverse delivers evidence-based, multi-model clinical intelligence with safety guardrails and instant integrations.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexSans.variable}`}>
      <body className="bg-slate-950 text-slate-100 antialiased font-sans">{children}</body>
    </html>
  );
}
