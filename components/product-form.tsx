'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { updateProduct, Product, createProduct } from '@/lib/products' // Certifique-se que deleteProduct existe no seu lib
import { Category } from '@/lib/categories'
import { v4 as uuidv4 } from 'uuid'
import { Trash2, X } from 'lucide-react' // Instale: npm install lucide-react

export default function ProductForm({ product, categories }: { product?: any, categories: Category[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [existingImages, setExistingImages] = useState<any[]>([])
    const supabase = createClient()

    // Carregar imagens existentes quando o componente montar
    useEffect(() => {
        if (product?.id) {
            fetchImages()
        }
    }, [product])

    async function fetchImages() {
        const { data } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', product.id)
        if (data) setExistingImages(data)
    }

    // FUNÇÃO PARA DELETAR UMA IMAGEM ESPECÍFICA
    async function handleDeleteImage(imageId: string, imageUrl: string) {
        if (!confirm('Tem certeza que deseja remover esta imagem?')) return

        try {
            // 1. Remover do Storage
            const fileName = imageUrl.split('/').pop()
            if (fileName) {
                await supabase.storage.from('products').remove([fileName])
            }

            // 2. Remover do Banco
            await supabase.from('product_images').delete().eq('id', imageId)
            
            // Atualiza a lista na tela
            setExistingImages(existingImages.filter(img => img.id !== imageId))
        } catch (err) {
            alert('Erro ao deletar imagem')
        }
    }

    // FUNÇÃO PARA DELETAR O PRODUTO INTEIRO
    async function handleDeleteProduct() {
        if (!confirm('TEM CERTEZA? Isso apagará a obra e todas as fotos permanentemente.')) return
        
        setLoading(true)
        try {
            // Opcional: Deletar fotos do storage antes de apagar o produto
            const { data: images } = await supabase.from('product_images').select('url').eq('product_id', product.id)
            if (images) {
                const filesToDelete = images.map(img => img.url.split('/').pop()).filter(Boolean) as string[]
                if (filesToDelete.length > 0) {
                    await supabase.storage.from('products').remove(filesToDelete)
                }
            }

            // Deletar o registro do produto (o cascade limpa o resto no banco)
            const { error: delError } = await supabase.from('products').delete().eq('id', product.id)
            if (delError) throw delError

            router.push('/admin/products')
            router.refresh()
        } catch (err) {
            setError('Erro ao excluir produto')
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const imageFiles = formData.getAll('image_files') as File[]

        try {
            let productId = product?.id
            
            const productData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                stock: parseInt(formData.get('stock') as string),
                category_id: (formData.get('category_id') as string) || null,
                image_url: product?.image_url || '', 
            }

            if (product) {
                await updateProduct(product.id, productData)
            } else {
                const newProduct = await createProduct(productData)
                productId = newProduct.id
            }

            // Upload de novas imagens
            const validFiles = imageFiles.filter(f => f.size > 0)
            if (validFiles.length > 0) {
                for (const file of validFiles) {
                    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`
                    const { error: upErr } = await supabase.storage.from('products').upload(fileName, file)
                    if (upErr) throw upErr

                    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
                    
                    await supabase.from('product_images').insert({ product_id: productId, url: publicUrl })
                    
                    // Se não tiver capa, a primeira vira capa
                    if (!productData.image_url) {
                        productData.image_url = publicUrl
                        await updateProduct(productId, productData)
                    }
                }
            }

            router.push('/admin/products')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campos de Nome, Preço e Estoque (iguais ao anterior) */}
                    <div className="col-span-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Obra</label>
                        <input name="name" defaultValue={product?.name} required className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Preço</label>
                        <input name="price" type="number" step="0.01" defaultValue={product?.price} required className="w-full p-2 border rounded-md" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Estoque</label>
                        <input name="stock" type="number" defaultValue={product?.stock} required className="w-full p-2 border rounded-md" />
                    </div>

                    {/* GERENCIAMENTO DE IMAGENS JÁ EXISTENTES */}
                    <div className="col-span-full">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Fotos Atuais</label>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            {/* Capa Principal */}
                            {product?.image_url && (
                                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-500">
                                    <img src={product.image_url} className="w-full h-full object-cover" alt="Capa" />
                                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-[8px] px-1 font-bold uppercase">Capa</div>
                                </div>
                            )}
                            {/* Fotos Extras */}
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border group">
                                    <img src={img.url} className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => handleDeleteImage(img.id, img.url)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <label className="block text-sm font-bold text-gray-700 mb-1">Adicionar Novas Fotos</label>
                        <input type="file" name="image_files" accept="image/*" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                        <textarea name="description" defaultValue={product?.description} rows={4} className="w-full p-2 border rounded-md" />
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50">
                        {loading ? 'Salvando...' : product ? 'Salvar Alterações' : 'Publicar Obra'}
                    </button>

                    {/* BOTÃO DE EXCLUIR PRODUTO */}
                    {product && (
                        <button 
                            type="button" 
                            onClick={handleDeleteProduct}
                            disabled={loading}
                            className="w-full border border-red-200 text-red-500 py-3 rounded-lg font-medium hover:bg-red-50 transition flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} />
                            Excluir Obra Permanentemente
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}