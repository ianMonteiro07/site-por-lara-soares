'use client'

import { useState } from 'react'
import Image from 'next/image'

// --- LISTA DE FOTOS ---
// Adicione aqui os caminhos das suas fotos. 
// Elas devem estar na pasta "public" do seu projeto.
const IMAGES = [
  '/foto-sobre.JPG',
  '/foto-canto.jpg',   // Sua foto principal
  '/studio.jpg', // Exemplo (coloque o nome real das suas outras fotos)   // Exemplo
]

export default function AboutPage() {
  // Estado para controlar qual foto está aparecendo
  const [currentIndex, setCurrentIndex] = useState(0)

  // Função para voltar a foto
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? IMAGES.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  // Função para avançar a foto
  const nextSlide = () => {
    const isLastSlide = currentIndex === IMAGES.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  // Função para clicar na bolinha e ir direto para a foto
  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <section className="min-h-screen bg-[#f2edb6] text-[#1E1E1E]">
      
      {/* Container Principal */}
      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Título Centralizado */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 tracking-tight">
            Quem é Lara Soares?
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Arte autoral, sensibilidade e a busca pela beleza no imperfeito.
          </p>
        </div>

        {/* Grid: Slider na Esquerda, Texto na Direita */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* --- INÍCIO DO SLIDER --- */}
          <div className="relative aspect-[3/4] w-full rounded-3xl shadow-xl bg-[#FFF6DD] rotate-[-2deg] hover:rotate-0 transition-transform duration-500 group">
            
            {/* Máscara que esconde as fotos laterais */}
            <div className="w-full h-full overflow-hidden rounded-3xl relative">
              
              {/* O "Trem" de imagens que desliza */}
              <div 
                className="w-full h-full flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {IMAGES.map((src, index) => (
                  <div key={index} className="min-w-full h-full relative">
                    <Image
                      src={src}
                      alt={`Foto sobre Lara ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0} // Carrega a primeira foto mais rápido
                    />
                  </div>
                ))}
              </div>

              {/* Setas de Navegação (Aparecem ao passar o mouse e se houver mais de 1 foto) */}
              {IMAGES.length > 1 && (
                <>
                  {/* Botão Esquerda */}
                  <button 
                    onClick={prevSlide}
                    className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-4 bg-white/60 hover:bg-white text-gray-800 p-2 rounded-full cursor-pointer z-10 transition-colors shadow-md"
                  >
                    ❮
                  </button>

                  {/* Botão Direita */}
                  <button 
                    onClick={nextSlide}
                    className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-4 bg-white/60 hover:bg-white text-gray-800 p-2 rounded-full cursor-pointer z-10 transition-colors shadow-md"
                  >
                    ❯
                  </button>
                </>
              )}

              {/* Bolinhas (Dots) na parte inferior */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {IMAGES.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`cursor-pointer rounded-full h-2 shadow-sm transition-all duration-300 ${
                      currentIndex === index ? 'bg-white w-6' : 'bg-white/50 w-2'
                    }`}
                  ></div>
                ))}
              </div>

            </div>
          </div>
          {/* --- FIM DO SLIDER --- */}

          {/* TEXTO (Mantido original) */}
          <div className="flex flex-col gap-6">
            <h2 className="italic text-gray-700 text-3xl font-bold mb-2">
              Onde tudo começa
            </h2>
            
            <div className="text-lg text-gray-800 leading-relaxed flex flex-col gap-4">
              <p>
                Confesso que, para mim, criar algo com as mãos sempre foi muito mais fácil do que redigir um e-mail. É no toque, na textura e no processo artesanal que eu me encontro e me comunico melhor com o mundo.
              </p>
              <p>
                Sou uma artista autodidata e movida pelo que é orgânico. Minha maior fonte de inspiração é a natureza em seu todo — suas formas, cores e ciclos transbordam para tudo o que eu crio. 
              </p>
              <p>
                Acredito que a beleza não está na precisão industrial, mas na verdade do feito à mão: nenhum trabalho artesanal é perfeito, e é exatamente essa "imperfeição" que guarda a história e o carinho depositado em cada detalhe.
              </p>
            </div>

            {/* Destaque / Citação */}
            <div className="mt-6 p-8 bg-[#F5C76A] rounded-3xl shadow-sm text-[#1E1E1E]">
              <p className="font-bold italic text-xl text-center">
                "We don't make mistakes, we have happy accidents" - Bob Ross
              </p>
            </div>

            {/* Botão de Contato */}
            <div className="mt-4">
                <p className="text-sm font-bold text-gray-600 mb-2">Gostou do meu trabalho?</p>
                <a href="https://wa.me/5582933005934" target="_blank" className="inline-block text-lg font-extrabold border-b-2 border-[#1E1E1E] hover:text-[#555] transition-colors">
                    Vamos conversar no WhatsApp →
                </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}