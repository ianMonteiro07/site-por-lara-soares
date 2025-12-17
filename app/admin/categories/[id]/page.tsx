
import { getCategory } from '@/lib/categories'
import CategoryForm from '@/components/category-form'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    // In Next.js 15+, params is a promise but in 14 it's an object. 
    // Assuming 15 based on "next": "16.0.10" (which is actually very new/nightly? wait package.json said 16.0.10? Next 15 is latest stable. Maybe it's a future version or I misread).
    // Safest is to treat it as a promise if it is Next 15. 
    // Wait, let's check package.json again. "next": "16.0.10". That looks like a very recent version.
    // In recent Next.js versions (15+), params needs to be awaited.

    const { id } = await params
    const category = await getCategory(id)

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Category</h1>
            <CategoryForm category={category} />
        </div>
    )
}
