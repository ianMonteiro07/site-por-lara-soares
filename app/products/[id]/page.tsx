import { createClient } from '@/utils/supabase/server'
import { AquarelaPlaceholder } from '@/components/AquarelaPlaceholder'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProductPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()

  // --- BUSCA: Incluindo as fotos extras da tabela product_images ---
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images ( url )
    `)
    .eq('id', id)
    .maybeSingle()

  if (error || !product) {
    return notFound()
  }

  // --- CORREÇÃO DE DUPLICIDADE ---
  // Usamos o Set para remover URLs repetidas entre a capa e a galeria
  const allImages = Array.from(
    new Set([
      product.image_url,
      ...(product.product_images?.map((img: any) => img.url) || [])
    ])
  ).filter(Boolean) as string[]

  // --- CONFIGURAÇÃO DO WHATSAPP ---
  const phoneNumber = "5582933005934" 
  const message = `Olá! Vi a obra "${product.name}" no site e gostaria de saber mais detalhes.`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <section className="min-h-screen bg-[#f2edb6] relative">
      {/* Background Noise (Identidade Visual) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply fixed" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 lg:gap-16">

        {/* COLUNA DA ESQUERDA: SLIDER DE FOTOS */}
        <div className="relative">
          {allImages.length > 0 ? (
            // --- CORREÇÃO AQUI: Adicionado 'relative' nesta div ---
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#FFF6DD]">
              {/* Container do Carrossel */}
              <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {allImages.map((url, index) => (
                  <div 
                    key={index} 
                    className="min-w-full h-[450px] md:h-[600px] relative snap-center"
                  >
                    <img
                      src={url}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Bolinhas Indicadoras */}
              {allImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                  {allImages.map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 h-2 rounded-full bg-white/80 shadow-md border border-black/5" 
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl overflow-hidden h-[450px] md:h-[600px] relative flex items-center justify-center bg-[#FFF6DD] shadow-lg">
              <AquarelaPlaceholder />
            </div>
          )}
          
          {allImages.length > 1 && (
             <p className="text-center text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-4 font-bold animate-pulse">
               Deslize para ver detalhes →
             </p>
          )}
        </div>

        {/* COLUNA DA DIREITA: INFORMAÇÕES E COMPRA */}
        <div className="flex flex-col justify-center">
          <header className="mb-8">
            <span className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-3 block">
              Obra Original
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-6 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
               <p className="text-3xl font-light text-slate-800">
                 R$ {product.price.toFixed(2)}
               </p>
               <span className="h-1 w-1 rounded-full bg-gray-300"></span>
               <span className="text-sm text-gray-400 uppercase tracking-widest">Disponível</span>
            </div>
          </header>

          <div className="h-px bg-slate-900/10 w-full mb-8" />

          <p className="text-gray-600 mb-10 text-lg leading-relaxed font-light">
            {product.description || "Esta obra é uma peça única, criada manualmente com foco na textura e na expressão orgânica."}
          </p>

          <div className="space-y-6">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full md:w-fit rounded-full bg-slate-900 px-12 py-5 text-lg font-bold text-white hover:bg-slate-700 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
            >
              Comprar pelo WhatsApp
            </a>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 italic">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Conversar diretamente com a artista
            </div>
          </div>

          {/* Rodapé da Info */}
          <div className="mt-16 pt-8 border-t border-slate-900/5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Autenticidade</h4>
              <p className="text-xs text-slate-600">Assinada e datada pela artista.</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Transporte</h4>
              <p className="text-xs text-slate-600">Embalagem especial para obras de arte.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}