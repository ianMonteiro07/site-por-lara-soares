import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // 1. URL Base para o Next.js não se perder nas imagens
  metadataBase: new URL('https://site-por-lara-soares.vercel.app'),
  
  title: "Por Lara Soares | Ateliê de Arte & Cerâmica",
  description: "Peças exclusivas feitas à mão: a delicadeza da cerâmica e a força das telas autorais em um só refúgio criativo.",
  
  // 2. Referência ao arquivo de manifest que ajuda no SEO
  manifest: "/manifest.json",

  openGraph: {
    title: "Por Lara Soares",
    description: "Arte autoral para transformar espaços. Explore nossa coleção de cerâmicas artesanais e telas exclusivas.",
    url: "https://site-por-lara-soares.vercel.app",
    siteName: "Por Lara Soares",
    images: [
      {
        url: "/icon21.png", 
        width: 1200,
        height: 630,
        alt: "Logo Por Lara Soares",
      },
    ],
    locale: "pt-BR",
    type: "website",
  },

  // 3. Configuração de ícones reforçada com versão v=3 para quebrar o cache
  icons: {
    icon: [
      { url: "/icon21.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/icon21.png?v=3", sizes: "192x192", type: "image/png" },
      { url: "/icon21.png?v=3", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon21.png?v=3",
    apple: "/icon21.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <Navbar />
        
        <main className="flex-grow w-full">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}