import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

// Definição do tipo para não dar erro no TypeScript
type Product = {
  id: string
  name: string
  price: number
  image_url: string | null
  categories: { name: string } | null
}

export default async function Page() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`*, categories ( name )`)
    .order('created_at', { ascending: false })

  return (
    <section className="min-h-screen bg-[#f2edb6] text-[#1a1a1a]">
      {/* Background Noise (igual da Home para continuidade visual) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply fixed" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* Cabeçalho Elegante */}
        <header className="mb-20 text-center">
          <span className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase mb-4 block">
            Acervo Completo
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">
            Coleção Artística
          </h1>
          <p className="mt-4 text-lg text-gray-500 font-light max-w-xl mx-auto">
            Peças únicas, feitas à mão, carregadas de identidade e imperfeição.
          </p>
        </header>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products?.map((product: Product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group flex flex-col gap-4 cursor-pointer"
            >
              {/* Área da Imagem */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-md">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f0e6d2] text-gray-400 font-serif italic">
                    Sem Imagem
                  </div>
                )}
                
                {/* Overlay ao passar o mouse */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Informações Minimalistas */}
              <div className="text-center">
                <h3 className="text-xl font-serif text-slate-900 mb-1 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                  {product.categories?.name || 'Obra Original'}
                </p>

                <div className="flex items-center justify-center gap-3">
                    <span className="text-sm font-medium text-slate-900">
                    R$ {product.price.toFixed(2)}
                    </span>
                    {/* Bolinha separadora */}
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-sm font-bold text-slate-900 underline decoration-1 underline-offset-4 group-hover:text-gray-600">
                        Ver
                    </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Se a lista estiver vazia */}
        {(!products || products.length === 0) && (
            <div className="text-center py-20 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-400 italic font-serif text-xl">Nenhuma obra disponível no momento.</p>
            </div>
        )}

      </div>
    </section>
  )
}