'use client' // 👈 Necessário para o botão funcionar

import { useState } from 'react'
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/fechar menu

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Produtos', path: '/products' },
    { name: 'Sobre', path: '/about' }
  ];

  return (
    <nav className="sticky top-0 left-0 z-50 w-full bg-[#fbf48d] backdrop-blur-md border-b border-[#D4C7B7]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* --- LOGO (Esquerda) --- */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-stone-800/20 group-hover:border-stone-800 transition-colors">
                <Image 
                  src="/icon21.png"
                  alt="Logo Por Lara Soares"
                  fill
                  className="object-cover"
                />
              </div>
              {/* No celular, diminuímos um pouco a fonte (text-lg) para caber melhor */}
              <span className="text-lg md:text-xl font-serif text-stone-800 tracking-tight transition-all duration-300 group-hover:text-[#D4AF37]">
                Por Lara Soares
              </span>
            </Link>
          </div>

          {/* --- MENU DESKTOP (Centro) - Escondido no Mobile --- */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="group relative text-sm font-medium tracking-widest text-stone-600 uppercase hover:text-stone-900 transition-all duration-300"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-stone-800 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* --- BOTÃO ATELIÊ (Direita Desktop) - Escondido no Mobile --- */}
          <div className="hidden md:block">
            <Link
              href="/game"
              className="inline-flex items-center justify-center px-6 py-2 border border-stone-800 rounded-full text-xs font-bold tracking-widest uppercase text-stone-800 hover:bg-stone-800 hover:text-[#FDFBF7] transition-all duration-300"
            >
              Ateliê Criativo
            </Link>
          </div>

          {/* --- BOTÃO HAMBÚRGUER (Mobile) - Visível só no celular --- */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-800 focus:outline-none"
              aria-label="Menu Principal"
            >
              {isOpen ? (
                // Ícone de Fechar (X)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                // Ícone de Menu (Hambúrguer)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENU MOBILE EXPANSÍVEL --- */}
      {/* Se isOpen for true, mostra essa div */}
      {isOpen && (
        <div className="md:hidden bg-[#fbf48d] border-t border-[#D4C7B7]">
          <div className="space-y-1 px-6 pb-6 pt-4">
            
            {/* Links do Menu Mobile */}
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsOpen(false)} // Fecha o menu ao clicar
                className="block py-3 text-base font-medium text-stone-700 hover:text-[#D4AF37] border-b border-stone-800/10"
              >
                {item.name}
              </Link>
            ))}

            {/* Botão Ateliê no Mobile */}
            <div className="pt-4">
               <Link
                href="/game"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center px-6 py-3 border border-stone-800 rounded-full text-xs font-bold tracking-widest uppercase text-stone-800 hover:bg-stone-800 hover:text-[#FDFBF7] transition-all"
              >
                Ateliê Criativo
              </Link>
            </div>
            
          </div>
        </div>
      )}
    </nav>
  );
}