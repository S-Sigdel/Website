import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StatusProvider } from "./context/StatusContext";
import SearchOverlay from "./components/SearchOverlay";
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
    icon: '/favicon.svg',
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
          {children}
          <SearchOverlay />
        </StatusProvider>
      </body>
    </html>
  );
}
