import "./globals.css";

function getSiteUrl() {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!configuredSiteUrl) {
    return "http://localhost:3001";
  }

  return configuredSiteUrl.startsWith("http")
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`;
}

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fruit Store CMS",
  description: "Inventory, orders, purchases, suppliers, reports, and settings in one fruit store dashboard.",
  openGraph: {
    title: "Fruit Store CMS",
    description: "Inventory, orders, purchases, suppliers, reports, and settings in one fruit store dashboard.",
    url: siteUrl,
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
