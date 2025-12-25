import { createClient } from '@/utils/supabase/server'
import { AquarelaPlaceholder } from '@/components/AquarelaPlaceholder'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProductPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  const supabase = await createClient()

  // --- BUSCA ATUALIZADA: Incluindo as fotos extras ---
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images ( url )
    `)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    return (
      <pre className="p-10 text-sm">
        {JSON.stringify(error, null, 2)}
      </pre>
    )
  }

  if (!product) {
    return notFound()
  }

  // --- LÓGICA DAS IMAGENS ---
  // Combinamos a imagem principal com as extras em um único array
  const allImages = [
    product.image_url,
    ...(product.product_images?.map((img: any) => img.url) || [])
  ].filter(Boolean)

  // --- CONFIGURAÇÃO DO WHATSAPP ---
  const phoneNumber = "5582933005934" 
  const message = `Olá! Vi a obra "${product.name}" no site e gostaria de saber mais detalhes.`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <section className="min-h-screen bg-[#f2edb6]">
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">

        {/* CONTAINER DO SLIDER (COLUNA DA ESQUERDA) */}
        <div className="relative group">
          {allImages.length > 0 ? (
            <div className="rounded-3xl overflow-hidden shadow-lg bg-[#FFF6DD]">
              {/* Carrossel com Scroll Snap */}
              <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {allImages.map((url, index) => (
                  <div 
                    key={index} 
                    className="min-w-full h-[500px] md:h-[600px] relative snap-center"
                  >
                    <img
                      src={url}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Indicadores Visuais (Bolinhas) */}
              {allImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {allImages.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/70 shadow-sm" />
                  ))}
                </div>
              )}
              
              {/* Dica visual para mobile */}
              {allImages.length > 1 && (
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/50 uppercase tracking-widest font-bold md:hidden">
                  Arraste para o lado →
                </p>
              )}
            </div>
          ) : (
            /* Caso não haja imagem nenhuma */
            <div className="rounded-3xl overflow-hidden h-[480px] relative flex items-center justify-center bg-[#FFF6DD] shadow-lg">
              <AquarelaPlaceholder />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />
            </div>
          )}
        </div>

        {/* INFO (COLUNA DA DIREITA) */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold mb-4 text-[#1E1E1E] font-serif">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md">
            {product.description || "Obra original, peça única carregada de identidade e imperfeição artística."}
          </p>

          <div className="flex items-baseline gap-4 mb-10">
            <p className="text-4xl font-bold text-[#1E1E1E]">
              R$ {product.price.toFixed(2)}
            </p>
            <span className="text-sm text-gray-400 uppercase tracking-widest">
              Peça Única
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full md:w-fit rounded-full bg-[#F5C76A] px-12 py-5 text-xl font-bold text-[#1E1E1E] hover:scale-[1.02] transition-all text-center cursor-pointer shadow-sm hover:shadow-xl active:scale-95"
            >
              Comprar pelo WhatsApp
            </a>
            
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Fale diretamente com a artista para finalizar.
            </p>
          </div>

          {/* Características Adicionais */}
          <div className="mt-12 pt-8 border-t border-black/5 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Técnica</h4>
              <p className="text-sm text-gray-700">Original / Mista</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Envio</h4>
              <p className="text-sm text-gray-700">Todo o Brasil</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}