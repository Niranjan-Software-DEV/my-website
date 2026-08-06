import type { Metadata } from "next";
import { Special_Elite, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const typewriter = Special_Elite({
  variable: "--font-typewriter",
  subsets: ["latin"],
  weight: "400",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "The Crimson Room — A Murder Mystery Experience",
  description:
    "Book your seat at the table of intrigue. An immersive murder-mystery evening where you are the detective. Dossiers, suspects, red string — and one truth hidden in the dark.",
  keywords: [
    "murder mystery",
    "immersive theatre",
    "booking",
    "detective experience",
    "noir",
  ],
  authors: [{ name: "The Crimson Room" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${typewriter.variable} ${playfair.variable} ${cormorant.variable} antialiased noir-root`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
