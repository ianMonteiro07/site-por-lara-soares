import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Fonte mais padrão de mercado
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer"; // Vamos criar esse componente jaja

// Configuração da Fonte Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Por Lara Soares | Ateliê de Arte & Cerâmica ", // Nome que vai aparecer no título
  description: "Peças exclusivas feitas à mão: a delicadeza da cerâmica e a força das telas autorais em um só refúgio criativo.", // Descrição da loja
  openGraph: {
    title: "Por Lara Soares",
    description: "Arte autoral para transformar espaços. Explore nossa coleção de cerâmicas artesanais e telas exclusivas.",
    url: "https://site-por-lara-soares.vercel.app",
    siteName: "Por Lara Soares",
    images: [
      {
        url: "/icon21.png", // Nome exato do arquivo que você colocou na pasta public
        width: 1200,
        height: 630,
        alt: "Logo Por Lara Soares",
      },
    ],
    locale: "pt-BR",
    type: "website",
  },
  // Isso remove o ícone de triângulo (que costuma ser o ícone padrão da Vercel)
  icons: {
    icon: [
      { url: "/icon21.png", sizes: "32x32" },
      { url: "/icon21.png", sizes: "192x192" }, // Versão maior para alta densidade de pixels
      { url: "/icon21.png", sizes: "512x512" }, // Versão para telas retina
    ],
    apple: "/icon21.png", // Ícone que aparece quando salvam seu site no iPhone
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        {/* Navbar Fixa no topo ou normal */}
        <Navbar />
        
        {/* Main ocupando o espaço restante */}
        <main className="flex-grow w-full">
          {children}
        </main>

        {/* Rodapé Profissional */}
        <Footer />
      </body>
    </html>
  );
}
