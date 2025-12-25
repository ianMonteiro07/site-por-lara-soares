'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { createProduct, updateProduct, Product } from '@/lib/products'
import { Category } from '@/lib/categories'
import { v4 as uuidv4 } from 'uuid'

export default function ProductForm({ product, categories }: { product?: Product, categories: Category[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const stock = parseInt(formData.get('stock') as string)
        const category_id = formData.get('category_id') as string
        
        // Pega todos os arquivos selecionados
        const imageFiles = formData.getAll('image_files') as File[]

        try {
            let productId = product?.id
            let main_image_url = product?.image_url || ''

            // 1. Criar ou Atualizar o produto primeiro
            const productData = {
                name,
                description,
                price,
                stock,
                category_id: category_id || null,
                image_url: main_image_url, 
            }

            if (product) {
                await updateProduct(product.id, productData)
            } else {
                const newProduct = await createProduct(productData)
                productId = newProduct.id
            }

            // 2. Upload das Imagens
            if (imageFiles.length > 0 && imageFiles[0].size > 0) {
                const uploadPromises = imageFiles.map(async (file, index) => {
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${uuidv4()}.${fileExt}`
                    
                    const { error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(fileName, file)

                    if (uploadError) throw uploadError

                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(fileName)

                    return publicUrl
                })

                const uploadedUrls = await Promise.all(uploadPromises)

                // 3. Salvar URLs na tabela de imagens extras
                const imageInserts = uploadedUrls.map(url => ({
                    product_id: productId,
                    url: url
                }))

                const { error: insertError } = await supabase
                    .from('product_images')
                    .insert(imageInserts)

                if (insertError) throw insertError

                // Opcional: Se o produto não tinha imagem principal, define a primeira como principal
                if (!main_image_url && uploadedUrls.length > 0) {
                    await updateProduct(productId!, { ...productData, image_url: uploadedUrls[0] })
                }
            }

            router.push('/admin/products')
            router.refresh()
        } catch (err: any) {
            setError('Erro ao salvar produto: ' + err.message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-white p-6 rounded-lg shadow">
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Nome da Obra</label>
                    <input
                        name="name"
                        defaultValue={product?.name}
                        required
                        className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={product?.price}
                        required
                        className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Estoque</label>
                    <input
                        name="stock"
                        type="number"
                        defaultValue={product?.stock}
                        required
                        className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <select
                        name="category_id"
                        defaultValue={product?.category_id || ''}
                        className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Selecione uma categoria...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Fotos (Selecione várias se desejar)</label>
                    {product?.image_url && (
                        <div className="mb-2">
                            <p className="text-xs text-gray-400 mb-1">Imagem Principal Atual:</p>
                            <img src={product.image_url} alt="Principal" className="h-20 w-20 object-cover rounded border" />
                        </div>
                    )}
                    <input
                        type="file"
                        name="image_files"
                        accept="image/*"
                        multiple // PERMITE VÁRIAS FOTOS
                        className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                        name="description"
                        defaultValue={product?.description || ''}
                        rows={3}
                        className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Salvando Obra...' : product ? 'Atualizar Obra' : 'Criar Obra'}
                </button>
            </div>
        </form>
    )
}