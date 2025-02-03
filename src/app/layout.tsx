import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechOasis - Your Ultimate Hardware Destination",
  description: "Discover top-quality computer hardware, peripherals, and accessories at the best prices.",
  icons: {
    icon: "/favicon.ico", // Ensure this file exists in `public/`
  },
  openGraph: {
    title: "TechOasis - Premium Hardware & Accessories",
    description: "Find high-performance computer components, peripherals, and accessories for all your needs.",
    url: "https://techoasis.com",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists in `public/`
        width: 1200,
        height: 630,
        alt: "TechOasis - Premium Hardware & Accessories",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
