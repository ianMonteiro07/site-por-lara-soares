'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client' // Certifique-se que esse path está certo
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Erro: ' + error.message)
      setLoading(false)
    } else {
      router.push('/admin') // Manda para o painel se der certo
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2edb6]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-serif font-bold text-center mb-6 text-slate-800">Acesso Restrito</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required 
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded font-bold hover:bg-slate-700 transition"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </div>
      </form>
    </div>
  )
}