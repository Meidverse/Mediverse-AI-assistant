import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
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
      <body className="dark:bg-slate-950 light:bg-gray-50 dark:text-slate-100 light:text-gray-900 antialiased font-sans transition-colors">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
