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
  title: {
    template: '%s | Minha Loja', // Faz títulos dinâmicos (ex: "Produto X | Minha Loja")
    default: 'Minha Loja Exclusiva',
  },
  description: "A melhor curadoria de arte e decoração.",
};

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
