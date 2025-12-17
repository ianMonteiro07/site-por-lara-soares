import Image from 'next/image'

export default function AboutPage() {
  return (
    // Fundo #f2edb6 igual ao que você gostou na página de produtos
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

        {/* Grid: Foto na Esquerda, Texto na Direita */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* FOTO (Com efeito leve de rotação para parecer polaroid/artístico) */}
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-xl bg-[#FFF6DD] rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="/studio.jpg" // Certifique-se que a foto está na pasta public com esse nome
              alt="Lara Soares pintando no estúdio"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* TEXTO */}
          <div className="flex flex-col gap-6">
            <h2 className="italic text-gray-700 text-3xl font-bold mb-2">
              Onde tudo começa
            </h2>
            
            <div className="text-lg text-gray-800 leading-relaxed flex flex-col gap-4">
              <p>
                Para mim, pintar não é apenas aplicar tinta sobre a tela. É um processo de silêncio, de escuta e de tradução do que sinto para o mundo real.
              </p>
              <p>
                Cada obra nasce de um sentimento genuíno. Gosto de pensar que minhas telas não servem apenas para decorar paredes, mas para trazer vida, cor e uma nova energia para o ambiente de quem as escolhe.
              </p>
              <p>
                No meu ateliê, em contato com a natureza, busco as texturas e as cores que melhor representam essa conexão.
              </p>
            </div>

            {/* Destaque / Citação */}
            <div className="mt-6 p-8 bg-[#F5C76A] rounded-3xl shadow-sm text-[#1E1E1E]">
              <p className="font-bold italic text-xl text-center">
                "Criar é dar forma ao invisível."
              </p>
            </div>

            {/* Botão de Contato Rápido (Opcional) */}
            <div className="mt-4">
                <p className="text-sm font-bold text-gray-600 mb-2">Gostou do meu trabalho?</p>
                <a href="https://wa.me/5582999999999" target="_blank" className="inline-block text-lg font-extrabold border-b-2 border-[#1E1E1E] hover:text-[#555] transition-colors">
                    Vamos conversar no WhatsApp →
                </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}