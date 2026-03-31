import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://fruite-store-system-frontend-nsoy.vercel.app"),
  title: "Fruit Store CMS",
  description: "Inventory, orders, purchases, suppliers, reports, and settings in one fruit store dashboard.",
  openGraph: {
    title: "Fruit Store CMS",
    description: "Inventory, orders, purchases, suppliers, reports, and settings in one fruit store dashboard.",
    url: "https://fruite-store-system-frontend-nsoy.vercel.app",
    siteName: "Fruit Store CMS",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Fruit Store CMS preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fruit Store CMS",
    description: "Inventory, orders, purchases, suppliers, reports, and settings in one fruit store dashboard.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
