import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { MarketProvider } from "@/context/MarketContext";

export const metadata: Metadata = {
  title: "Pulse — Crypto Market Dashboard",
  description:
    "Real-time cryptocurrency market data. Track prices, market caps, and 24h changes for the top digital assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/fonts/helvetica/helvetica-now-display/stylesheet.css" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <WatchlistProvider>
            <MarketProvider>{children}</MarketProvider>
          </WatchlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
