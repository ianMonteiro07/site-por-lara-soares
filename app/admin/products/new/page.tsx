
import ProductForm from '@/components/product-form'
import { getCategories } from '@/lib/categories'

export default async function NewProductPage() {
    const categories = await getCategories()

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">New Product</h1>
            <ProductForm categories={categories} />
        </div>
    )
}
