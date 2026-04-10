import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["400", "700", "900"], variable: "--font-playfair" });

export const metadata: Metadata = { title: "Preview" };

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${playfair.variable} ${inter.className}`}>
      {children}
    </div>
  );
}
