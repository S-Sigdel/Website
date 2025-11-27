import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StatusProvider } from "./context/StatusContext";
import { SearchProvider } from "./context/SearchContext";
import SearchOverlay from "./components/SearchOverlay";
import Background from "./components/Background";
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
  title: "~/portfolio",
  description: "Low-level enthusiast portfolio",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base text-text`}
      >
        <StatusProvider>
          <SearchProvider>
            <Background />
            <div className="relative z-10">
              {children}
            </div>
            <SearchOverlay />
          </SearchProvider>
        </StatusProvider>
      </body>
    </html>
  );
}
