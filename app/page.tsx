import { createClient } from '@/utils/supabase/server'
import HomeClient from '@/components/HomeClient'

export default async function Home() {
  const supabase = await createClient()

  // Adicionamos 'error' na desestruturação para pegar falhas do banco
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, image_url')
    .limit(5)
    .order('created_at', { ascending: false })

  // --- DIAGNÓSTICO (ISSO VAI APARECER NO SEU TERMINAL PRETO) ---
  console.log("--------------------------------------------------")
  if (error) {
    console.error("❌ ERRO DO SUPABASE:", error.message)
    console.error("Detalhes:", error)
  } else {
    console.log("✅ SUCESSO! Produtos encontrados:", products?.length || 0)
    if (products && products.length > 0) {
        console.log("Primeiro produto:", products[0].name)
    } else {
        console.log("⚠️ A lista voltou vazia. Verifique se criou produtos e a Policy RLS.")
    }
  }
  console.log("--------------------------------------------------")
  // -------------------------------------------------------------

  // Passamos a lista (ou lista vazia se for null) para o componente visual
  return <HomeClient products={products || []} />
}