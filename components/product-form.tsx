
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
        const imageFile = formData.get('image_file') as File

        let image_url = product?.image_url || ''

        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${uuidv4()}.${fileExt}`
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile)

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName)

            image_url = publicUrl
        }

        const data = {
            name,
            description,
            price,
            stock,
            category_id: category_id || null, // Handle empty string as null
            image_url,
        }

        try {
            if (product) {
                await updateProduct(product.id, data)
            } else {
                await createProduct(data)
            }
            router.push('/admin/products')
            router.refresh()
        } catch (err) {
            setError('Error saving product')
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
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        name="name"
                        defaultValue={product?.name}
                        required
                        className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
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
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                        name="stock"
                        type="number"
                        defaultValue={product?.stock}
                        required
                        className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category_id"
                        defaultValue={product?.category_id || ''}
                        className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select a category...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    {product?.image_url && (
                        <div className="mb-2">
                            <img src={product.image_url} alt="Current product" className="h-32 w-32 object-cover rounded" />
                        </div>
                    )}
                    <input
                        type="file"
                        name="image_file"
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
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
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    )
}
