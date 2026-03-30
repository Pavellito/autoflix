import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/app/components/Header";
import SignInModal from "@/app/components/SignInModal";
import { FavoritesProvider } from "@/app/lib/favorites-context";
import { AuthProvider } from "@/app/lib/auth-context";
import { WatchProgressProvider } from "@/app/lib/watch-progress-context";
import { LanguageProvider } from "@/app/lib/i18n/context";
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
  title: "AutoFlix – Netflix for Cars",
  description: "Discover, watch, and get AI summaries of the best car videos.",
  openGraph: {
    title: "AutoFlix",
    description: "Your ultimate streaming platform for car reviews, comparisons, and tuning.",
    url: "https://autoflix-alpha.vercel.app",
    siteName: "AutoFlix",
    images: [
      {
        url: "https://autoflix-alpha.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AutoFlix - Netflix for Cars",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoFlix – Netflix for Cars",
    description: "Discover, watch, and get AI summaries of the best car videos.",
    images: ["https://autoflix-alpha.vercel.app/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#141414] text-[#e5e5e5]">
        <LanguageProvider>
          <AuthProvider>
            <FavoritesProvider>
              <WatchProgressProvider>
                <Header />
                <SignInModal />
                <main className="flex-1">{children}</main>
              </WatchProgressProvider>
            </FavoritesProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
