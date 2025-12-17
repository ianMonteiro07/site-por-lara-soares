
import { getProduct } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import ProductForm from '@/components/product-form'

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const { id } = await params

    // Parallel fetching
    const [product, categories] = await Promise.all([
        getProduct(id),
        getCategories()
    ])

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Product</h1>
            <ProductForm product={product} categories={categories} />
        </div>
    )
}
