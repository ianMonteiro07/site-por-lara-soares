import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-yellow-200 border-t border-[#E5E0D8] pt-20 pb-10 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* COLUNA 1: MARCA E PROPÓSITO (Ocupa 4 colunas) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-4 group">
              
              {/* --- MUDANÇA AQUI --- */}
              {/* Adicionamos 'rounded-full' (arredonda) e 'overflow-hidden' (corta o que sobrar) */}
              <div className="relative h-12 w-12 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Logo Por Lara Soares"
                  fill
                  // Mudei para 'object-cover' para garantir que a imagem preencha todo o círculo sem deixar bordas vazias
                  className="object-cover" 
                  sizes="48px"
                />
              </div>

              <span className="text-xl font-serif text-stone-900 tracking-tight group-hover:text-[#D4AF37] transition-colors">
                Por Lara Soares
              </span>
              
            </Link>
            <p className="text-sm text-stone-700 leading-relaxed max-w-sm">
              Arte autoral que traduz o silêncio em cores. Peças únicas, feitas à mão, carregadas de identidade e imperfeição para ambientes com alma.
            </p>
          </div>

          {/* COLUNA 2: NAVEGAÇÃO (Ocupa 2 colunas) */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="font-serif font-bold text-stone-900 mb-6">Explorar</h4>
            <ul className="space-y-4 text-sm font-medium text-stone-600">
              <li>
                <Link href="/" className="hover:text-[#D4AF37] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#D4AF37] transition-colors">
                  Galeria de Obras
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                  Sobre a Artista
                </Link>
              </li>
              
            </ul>
          </div>

          {/* COLUNA 3: CONTATO E SOCIAL (Ocupa 4 colunas) */}
          <div className="md:col-span-4 md:col-start-9">
            <h4 className="font-serif font-bold text-stone-900 mb-6">Contato & Ateliê</h4>
            
            <div className="space-y-4 text-sm text-stone-600">
              <p>Maceió, Alagoas — Enviamos para todo o Brasil.</p>
              
              <a href="mailto:contato@porlarasoares.com.br" className="block hover:text-stone-900 transition-colors">
                contato@porlarasoares.com.br
              </a>

              {/* Ícones Sociais */}
              <div className="flex items-center gap-4 mt-6">
                
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/porlarasoares" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-stone-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://wa.me/5582999999999" // Coloque o número real aqui
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-stone-200 hover:border-green-600 hover:text-green-600 transition-all"
                  aria-label="WhatsApp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </a>

              </div>
            </div>
          </div>

        </div>

        {/* BARRA INFERIOR: COPYRIGHT */}
        <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 opacity-60 text-xs">
          <p>
            © {currentYear} Por Lara Soares. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-stone-900">Termos de Uso</span>
            <span className="cursor-pointer hover:text-stone-900">Política de Privacidade</span>
          </div>
        </div>

      </div>
    </footer>
  )
}