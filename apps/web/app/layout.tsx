import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "DOMQA", description: "Element-aware bug reporting for frontend teams." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
