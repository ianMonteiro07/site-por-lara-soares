import { createClient } from '@/utils/supabase/server'
import { AquarelaPlaceholder } from '@/components/AquarelaPlaceholder'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProductPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
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

  // --- CONFIGURAÇÃO DO WHATSAPP ---
  // ⚠️ MUDE AQUI PARA O NÚMERO DA LARA (Apenas números, com DDD)
  const phoneNumber = "5582933005934" 
  
  const message = `Olá! Vi a obra "${product.name}" no site e gostaria de saber mais detalhes.`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <section className="min-h-screen bg-[#f2edb6]">
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">

        {/* IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-lg bg-[#FFF6DD]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-[480px] relative flex items-center justify-center overflow-hidden">
              <AquarelaPlaceholder />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-4 text-[#1E1E1E]">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            {product.description || "Obra original, peça única."}
          </p>

          <p className="text-3xl font-bold mb-8 text-[#1E1E1E]">
            R$ {product.price.toFixed(2)}
          </p>

          {/* BOTÃO DO WHATSAPP (COM O ESTILO ORIGINAL) */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-fit rounded-full bg-[#F5C76A] px-10 py-4 text-lg font-bold text-[#1E1E1E] hover:brightness-105 transition text-center cursor-pointer shadow-sm hover:shadow-md"
          >
            Comprar pelo WhatsApp
          </a>
          
          <p className="mt-3 text-sm text-gray-500">
            Fale diretamente com a artista para finalizar.
          </p>
        </div>
      </div>
    </section>
  )
}