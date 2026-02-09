import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Atharva | Design Portfolio",
  description: "Personal design portfolio showcasing creative work and projects",
  keywords: ["design", "portfolio", "creative", "UI/UX", "graphic design", "atharva"],
  authors: [{ name: "Atharva" }],
  metadataBase: new URL("https://atharva.cc"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Atharva | Design Portfolio",
    description: "Personal design portfolio showcasing creative work and projects",
    url: "https://atharva.cc",
    siteName: "Atharva",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atharva | Design Portfolio",
    description: "Personal design portfolio showcasing creative work and projects",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Root layout: font applies to all pages */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
