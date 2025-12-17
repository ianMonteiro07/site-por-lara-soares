
import { supabase } from './supabase'

export interface Product {
    id: string
    category_id: string | null
    name: string
    description: string | null
    price: number
    stock: number
    image_url: string | null
    created_at: string
    // Join fields
    categories?: {
        name: string
    }
}

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      categories (
        name
      )
    `)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as Product[]
}

export async function getProduct(id: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data as Product
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'categories'>) {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()

    if (error) throw error
    return data as Product
}

export async function updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as Product
}

export async function deleteProduct(id: string) {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) throw error
}
