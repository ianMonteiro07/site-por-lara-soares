
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, updateCategory, Category } from '@/lib/categories'

export default function CategoryForm({ category }: { category?: Category }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string

        try {
            if (category) {
                await updateCategory(category.id, { name, slug })
            } else {
                await createCategory({ name, slug })
            }
            router.push('/admin/categories')
            router.refresh()
        } catch (err) {
            setError('Error saving category')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md space-y-4 bg-white p-6 rounded-lg shadow">
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    name="name"
                    defaultValue={category?.name}
                    required
                    className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                    name="slug"
                    defaultValue={category?.slug}
                    required
                    className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </button>
        </form>
    )
}
