'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'

export default function CreativeAtelier() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mobileContainerRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<ImageData[]>([])
  
  // NOVO: Estado para saber se é desktop e evitar conflito de Ref
  const [isDesktop, setIsDesktop] = useState(false) 
  
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#D4AF37') 
  const [lineWidth, setLineWidth] = useState(5)

  const colors = [
    '#D4AF37', // Dourado
    '#1a1a1a', // Preto Pedra
    '#E07A5F', // Terracota
    '#81B29A', // Verde Sálvia
    '#F2CC8F', // Amarelo Sol
    '#FFFFFF', // Borracha
  ]

  // --- LÓGICA DO CANVAS ---
  const saveState = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
    historyRef.current.push(snapshot)
    if (historyRef.current.length > 30) historyRef.current.shift()
  }

  const redrawCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
     ctx.fillStyle = '#FFF6DD'
     ctx.fillRect(0, 0, width, height)

     if (historyRef.current.length > 0) {
         const lastState = historyRef.current[historyRef.current.length - 1];
         createImageBitmap(lastState).then((bitmap) => {
             ctx.drawImage(bitmap, 0, 0, width, height);
         });
     }
  }

  useEffect(() => {
    // 1. Detectar tamanho da tela inicialmente
    const checkIsDesktop = () => {
        setIsDesktop(window.innerWidth >= 768)
    }
    checkIsDesktop() // Roda ao montar

    const canvas = canvasRef.current
    
    // Função de resize
    const resizeCanvas = () => {
      // Atualiza o estado de desktop/mobile
      checkIsDesktop();

      // Nota: Precisamos pegar o canvas do ref ATUALIZADO após a renderização
      // Por segurança, usamos setTimeout ou verificamos se o ref existe
      const currentCanvas = canvasRef.current; 
      if (!currentCanvas) return;

      const ctx = currentCanvas.getContext('2d')
      if (!ctx) return;

      if (window.innerWidth >= 768) {
          // PC
          currentCanvas.width = window.innerWidth
          currentCanvas.height = window.innerHeight
      } else {
          // CELULAR
          const container = mobileContainerRef.current;
          if (container) {
            currentCanvas.width = container.clientWidth;
            currentCanvas.height = container.clientHeight;
          }
      }
      
      redrawCanvas(ctx, currentCanvas.width, currentCanvas.height);
      
      if (historyRef.current.length === 0) {
        saveState(currentCanvas);
      }
    }

    // Delay inicial e Event Listener
    setTimeout(resizeCanvas, 100);
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [isDesktop]) // Adicionei isDesktop na dependência para garantir re-render se mudar

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;

    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable && e.type === 'touchstart') e.preventDefault();

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable && e.type === 'touchmove') e.preventDefault();
    
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = getCoordinates(e)
    
    ctx.lineTo(x, y)
    ctx.strokeStyle = color
    ctx.lineWidth = color === '#FFFFFF' ? 35 : lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowBlur = color === '#FFFFFF' ? 0 : 4
    ctx.shadowColor = color
    ctx.stroke()
  }

  const stopDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (isDrawing) {
        if (ctx) ctx.closePath()
        setIsDrawing(false)
        saveState(canvas)
    }
  }

  const undo = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    if (historyRef.current.length > 1) {
        historyRef.current.pop()
        const previousState = historyRef.current[historyRef.current.length - 1]
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(previousState, 0, 0)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    historyRef.current = [];
    redrawCanvas(ctx, canvas.width, canvas.height);
    saveState(canvas);
  }

  const saveArt = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d');
    if(ctx) {
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#FFF6DD';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    const link = document.createElement('a')
    link.download = 'minha-arte-lara-soares.png'
    link.href = canvas.toDataURL('image/png')
    link.click()

    if(ctx) ctx.globalCompositeOperation = 'source-over';
  }

  return (
    <div className="relative w-full min-h-screen md:h-screen md:overflow-hidden bg-[#FDFBF7]">
      
      {/* ========================================================
          LAYOUT PARA COMPUTADOR (MD:BLOCK)
         ======================================================== */}
      <div className="hidden md:block w-full h-full">
        {/* Renderiza APENAS se for Desktop para o ref pegar este elemento */}
        {isDesktop && (
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="absolute inset-0 z-0 cursor-crosshair"
            />
        )}
        
        {/* ... Resto do Cabeçalho Desktop (código igual) ... */}
        <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto bg-yellow-100 backdrop-blur-sm p-4 rounded-xl border border-gray-300 shadow-lg">
            <h1 className="text-2xl font-serif text-stone-900 font-bold">Ateliê Criativo</h1>
            <p className="text-sm text-stone-500 max-w-xs mt-1 leading-relaxed">
                Crie sua arte e mande pelo instagram.{' '}
                <a href="https://www.instagram.com/porlarasoares" target="_blank" rel="noopener noreferrer" className="font-bold text-stone-800 hover:text-[#D4AF37] transition-colors underline decoration-1 underline-offset-2">@porlarasoares</a>
                <br/>Para ganhar 5% de desconto.
            </p>
            <Link href="/products" className="mt-3 inline-block text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1 hover:text-gray-500 transition">← Voltar para a Loja</Link>
            </div>

            <div className="flex gap-2 pointer-events-auto">
                <button onClick={undo} className="bg-white/80 backdrop-blur border border-stone-200 p-3 rounded-full hover:bg-stone-100 text-stone-600 transition shadow-sm" title="Desfazer">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                </button>
                <button onClick={clearCanvas} className="bg-white/80 backdrop-blur border border-stone-200 p-3 rounded-full hover:bg-red-50 text-red-400 transition shadow-sm" title="Limpar Tudo">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <button onClick={saveArt} className="bg-stone-900 text-white p-3 rounded-full hover:bg-stone-700 transition shadow-lg" title="Baixar Arte">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
            </div>
        </div>

        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-50 flex flex-col items-center gap-6 pointer-events-auto border border-white/50 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-3">
            {colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${color === c ? 'border-stone-900 scale-125 shadow-lg' : 'border-transparent'}`} style={{ backgroundColor: c, boxShadow: c === '#FFFFFF' ? 'inset 0 0 0 1px #e5e5e5' : 'none' }} />
            ))}
            </div>
            <div className="h-px w-full bg-gray-200"></div>
            <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-gray-400">Pincel</span>
                <div className="h-24 w-6 flex items-center justify-center">
                    <input type="range" min="1" max="30" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} className="w-24 -rotate-90 origin-center accent-stone-900 cursor-pointer" />
                </div>
            </div>
        </div>
      </div>


      {/* ========================================================
          LAYOUT PARA CELULAR (MD:HIDDEN)
         ======================================================== */}
      <div className="md:hidden flex flex-col p-6 gap-6 pb-20">
        
        {/* ... Resto do Layout Mobile (igual) ... */}
        <div className="bg-yellow-100 p-5 rounded-xl border border-gray-300 shadow-sm">
            <h1 className="text-xl font-serif text-stone-900 font-bold mb-2">Ateliê Criativo</h1>
            <p className="text-sm text-stone-700 leading-relaxed mb-3">
                Use o dedo para criar sua arte na tela abaixo! Tire um print ou salve, e mande no Instagram <span className="font-bold">@porlarasoares</span> para ganhar 5% de desconto.
            </p>
        </div>

        <div className="flex items-center justify-between bg-white p-3 rounded-full border border-stone-200 shadow-sm">
            <Link href="/products" className="p-2 text-stone-500 hover:text-stone-900 flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar
            </Link>

            <div className="flex gap-2">
                <button onClick={undo} className="bg-stone-100 p-2 rounded-full border border-stone-200 text-stone-600 active:scale-95 transition" title="Desfazer">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                </button>
                <button onClick={clearCanvas} className="bg-red-50 p-2 rounded-full border border-red-100 text-red-500 active:scale-95 transition" title="Limpar">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <button onClick={saveArt} className="bg-stone-900 p-2 rounded-full border border-stone-900 text-white active:scale-95 transition shadow-md" title="Salvar">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
            </div>
        </div>

        <div 
            ref={mobileContainerRef}
            className="w-full aspect-square bg-[#FFF6DD] rounded-2xl border-2 border-dashed border-stone-300 shadow-inner relative overflow-hidden touch-none"
        >
             {/* Renderiza APENAS se for Mobile (não-Desktop) */}
             {!isDesktop && (
                <canvas
                    ref={canvasRef}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="md:hidden absolute inset-0 z-10 touch-none cursor-crosshair"
                />
             )}
            <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-serif italic pointer-events-none z-0">
                Sua tela de pintura...
            </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-5">
            <div>
                 <span className="text-xs font-bold uppercase text-stone-500 block mb-3">Paleta de Cores</span>
                 <div className="flex gap-3 flex-wrap">
                    {colors.map((c) => (
                        <button 
                            key={c} 
                            onClick={() => setColor(c)} 
                            className={`w-10 h-10 rounded-full border-2 ${color === c ? 'border-stone-900 scale-110 ring-2 ring-stone-100' : 'border-transparent'}`} 
                            style={{ backgroundColor: c, boxShadow: c === '#FFFFFF' ? 'inset 0 0 0 1px #e5e5e5' : 'none' }} 
                        />
                    ))}
                </div>
            </div>
            
             <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-stone-500">Tamanho do Pincel</span>
                    <div className="w-4 h-4 rounded-full bg-stone-900 transition-all" style={{ transform: `scale(${lineWidth / 15})` }} />
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={lineWidth} 
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    className="w-full accent-stone-900 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
      </div>

    </div>
  )
}