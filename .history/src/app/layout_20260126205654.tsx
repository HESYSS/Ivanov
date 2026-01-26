import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "DeFi Dashboard",
  description: "Wallet balance and portfolio tracking",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}