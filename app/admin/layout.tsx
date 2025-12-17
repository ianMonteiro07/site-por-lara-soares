
import Link from 'next/link'
import { LayoutDashboard, Tag, Package } from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-8 text-blue-400">Admin Panel</h2>
                <nav className="space-y-4">
                    <Link
                        href="/admin"
                        className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800 transition-colors"
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800 transition-colors"
                    >
                        <Tag size={20} />
                        <span>Categorias</span>
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800 transition-colors"
                    >
                        <Package size={20} />
                        <span>Produtos</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-slate-50 p-8">
                {children}
            </main>
        </div>
    )
}
