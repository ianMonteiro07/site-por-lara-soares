'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { updateProduct, createProduct } from '@/lib/products'
import { Category } from '@/lib/categories'
import { v4 as uuidv4 } from 'uuid'
import { Trash2, X } from 'lucide-react'

export default function ProductForm({ product, categories }: { product?: any, categories: Category[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [existingImages, setExistingImages] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        if (product?.id) { fetchImages() }
    }, [product])

    async function fetchImages() {
        const { data } = await supabase.from('product_images').select('*').eq('product_id', product.id)
        if (data) setExistingImages(data)
    }

    async function handleDeleteImage(imageId: string, imageUrl: string) {
        if (!confirm('Remover esta imagem?')) return
        try {
            const fileName = imageUrl.split('/').pop()
            if (fileName) { await supabase.storage.from('products').remove([fileName]) }
            await supabase.from('product_images').delete().eq('id', imageId)
            setExistingImages(existingImages.filter(img => img.id !== imageId))
        } catch (err) { alert('Erro ao deletar') }
    }

    async function handleDeleteProduct() {
        if (!confirm('Apagar obra permanentemente?')) return
        setLoading(true)
        try {
            const { error: delError } = await supabase.from('products').delete().eq('id', product.id)
            if (delError) throw delError
            router.push('/admin/products')
            router.refresh()
        } catch (err) { setError('Erro ao excluir') }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const imageFiles = formData.getAll('image_files') as File[]

        try {
            let productId = product?.id
            let current_main_url = product?.image_url || ''

            const productData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                stock: parseInt(formData.get('stock') as string),
                category_id: (formData.get('category_id') as string) || null,
                image_url: current_main_url, 
            }

            // 1. Salva/Atualiza o produto
            if (product) {
                await updateProduct(product.id, productData)
            } else {
                const newProduct = await createProduct(productData)
                productId = newProduct.id
            }

            // 2. Upload de Imagens (Lógica corrigida para não duplicar)
            const validFiles = imageFiles.filter(f => f.size > 0)
            if (validFiles.length > 0) {
                for (let i = 0; i < validFiles.length; i++) {
                    const file = validFiles[i]
                    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`
                    const { error: upErr } = await supabase.storage.from('products').upload(fileName, file)
                    if (upErr) throw upErr

                    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
                    
                    // SE o produto ainda não tem capa (image_url), a primeira foto vira a capa
                    if (!current_main_url) {
                        current_main_url = publicUrl
                        await updateProduct(productId, { ...productData, image_url: publicUrl })
                    } else {
                        // SE já tem capa, a foto vai para a galeria de imagens extras
                        await supabase.from('product_images').insert({ product_id: productId, url: publicUrl })
                    }
                }
            }

            // 3. Forçar atualização e redirecionar
            router.refresh() 
            router.push('/admin/products')
            // Pequeno delay para garantir que o banco processou antes de voltar
            setTimeout(() => router.refresh(), 500)
            
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Obra</label>
                        <input name="name" defaultValue={product?.name} required className="w-full p-2 border rounded-md" />
                    </div>

                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Preço</label>
                    <input name="price" type="number" step="0.01" defaultValue={product?.price} required className="w-full p-2 border rounded-md" /></div>

                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Estoque</label>
                    <input name="stock" type="number" defaultValue={product?.stock} required className="w-full p-2 border rounded-md" /></div>

                    <div className="col-span-full">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Fotos da Obra</label>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            {product?.image_url && (
                                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-900 shadow-md">
                                    <img src={product.image_url} className="w-full h-full object-cover" alt="Capa" />
                                    <div className="absolute top-0 left-0 bg-slate-900 text-white text-[8px] px-2 py-0.5 font-bold uppercase">Capa</div>
                                </div>
                            )}
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border group">
                                    <img src={img.url} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => handleDeleteImage(img.id, img.url)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input type="file" name="image_files" accept="image/*" multiple className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                        <textarea name="description" defaultValue={product?.description} rows={4} className="w-full p-2 border rounded-md" />
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50">
                        {loading ? 'Processando...' : product ? 'Salvar Alterações' : 'Publicar Obra'}
                    </button>
                    {product && (
                        <button type="button" onClick={handleDeleteProduct} disabled={loading}
                            className="text-red-500 text-sm font-medium hover:underline py-2">
                            Excluir Obra Permanentemente
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}