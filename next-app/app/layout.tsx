import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import TopLoader from "@/components/TopLoader";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Netonomy",
  description: "Own your digtial identity, data, and finances",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  applicationName: "Netonomy",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Netonomy",
    startupImage: "/splash.png",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: [
    {
      media: "(prefers-color-scheme: dark)",
      color: "#000000",
    },
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
  ],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-hidden`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TopLoader />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
