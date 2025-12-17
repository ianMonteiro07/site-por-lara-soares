'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  image_url: string | null
}

// FIX 1: "products = []" garante que se vier nulo, ele trata como lista vazia
export default function HomeClient({ products = [] }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Variável de segurança para saber se temos produtos reais
  const hasProducts = products && products.length > 0

  useEffect(() => {
    // FIX 2: Se não tem produtos, NÃO inicie o timer (evita o erro)
    if (!hasProducts) return

    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [currentIndex, hasProducts])

  const nextSlide = () => {
    if (hasProducts) {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }
  }

  const prevSlide = () => {
    if (hasProducts) {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
    }
  }

  // Produto atual seguro (com proteção contra undefined)
  const currentProduct = hasProducts ? products[currentIndex] : null

  return (
    <main className="relative min-h-screen bg-[#f2edb6] text-[#1a1a1a] overflow-hidden">
      
      {/* --- BACKGROUND ARTÍSTICO --- */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-50 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ffecd2] rounded-full blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute top-[40%] left-[-200px] w-[500px] h-[500px] bg-[#d4e4ef] rounded-full blur-[100px] opacity-40" />

      {/* =========================================
          SEÇÃO 1: HERO (SEMPRE APARECE, MESMO SEM PRODUTOS)
         ========================================= */}
      <section className="relative pt-32 pb-12 px-6 max-w-4xl mx-auto text-center z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase mb-6 block">Ateliê de Arte</span>
          <h1 className="text-6xl md:text-8xl font-serif text-slate-900 mb-6 tracking-tight">
            Por Lara Soares
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            Peças únicas para ambientes que contam histórias.
          </p>
        </motion.div>
      </section>

      {/* =========================================
          SEÇÃO 2: SLIDER BLINDADO
         ========================================= */}
      <section className="relative z-10 py-12 border-t border-gray-100/50 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* TÍTULO E CONTROLES */}
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-3xl font-serif text-slate-900">Últimas Criações</h2>
            {hasProducts && (
              <div className="flex gap-2">
                <button onClick={prevSlide} className="p-2 border border-slate-900/10 rounded-full hover:bg-white transition"><svg width="20" height="20" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6" /></svg></button>
                <button onClick={nextSlide} className="p-2 border border-gray-200 rounded-full hover:bg-white transition"><svg width="20" height="20" fill="none" stroke="currentColor"><path d="M9 18l6-6-6-6" /></svg></button>
              </div>
            )}
          </div>

          {/* ÁREA DO SLIDER */}
          {hasProducts && currentProduct ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-auto md:h-[500px]">
              
              {/* IMAGEM */}
              <div className="relative h-[400px] md:h-full w-full">
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentProduct.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                  >
                    {currentProduct.image_url ? (
                      <Image src={currentProduct.image_url} alt={currentProduct.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">Sem Imagem</div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* TEXTO */}
              <div className="flex flex-col justify-center pl-0 md:pl-10">
                <motion.div
                  key={currentProduct.id + 'info'}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-4xl font-serif text-slate-900 mb-4">{currentProduct.name}</h3>
                  <p className="text-gray-500 mb-8 font-light">Obra original.</p>
                  <Link 
                    href={`/products/${currentProduct.id}`}
                    className="inline-block border-b border-slate-900 pb-1 text-slate-900 hover:text-gray-600 transition-colors uppercase text-sm tracking-widest font-bold"
                  >
                    Comprar esta obra
                  </Link>
                </motion.div>
              </div>
            </div>
          ) : (
            // --- ESTADO VAZIO (SE NÃO TIVER PRODUTOS, MOSTRA ISSO EM VEZ DE QUEBRAR) ---
            <div className="w-full h-[300px] flex flex-col items-center justify-center bg-white/50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400 text-lg mb-2">Nenhuma obra encontrada.</p>
              <p className="text-sm text-gray-300">Verifique se você criou a Policy de leitura pública no Supabase.</p>
            </div>
          )}

        </div>
      </section>

      {/* =========================================
          SEÇÃO 3: MANIFESTO
         ========================================= */}
      <section className="py-24 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">O Processo</h2>
          <h3 className="text-3xl font-serif text-slate-900 mb-6">Imperfeição é beleza.</h3>
          <p className="text-gray-600 leading-relaxed font-light">
            "Por Lara Soares" é um convite para ver o mundo através de texturas, camadas e profundidade.
          </p>
        </div>
        {/* FOTO DO ESTÚDIO (Substitui o placeholder anterior) */}
        <div className="relative h-[450px] w-full bg-white p-3 rounded-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
           <div className="relative w-full h-full overflow-hidden rounded">
              <Image
                src="/studio.jpg" // Certifique-se que o nome do arquivo na pasta 'public' é esse
                alt="Lara Soares pintando no estúdio em meio à natureza"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
           </div>
        </div>
      </section>

    </main>
  )
}