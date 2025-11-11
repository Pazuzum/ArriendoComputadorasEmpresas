import React, { useRef, useState, useEffect } from 'react'

// Componente para capturar firma digital mediante canvas
const FirmaCanvas = ({ onFirmaGuardada, label = 'Firma aquí' }) => {
    const canvasRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true)

    // Configurar canvas al montar el componente
    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext('2d')
            ctx.strokeStyle = '#000'
            ctx.lineWidth = 2
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
        }
    }, [])

    // Iniciar trazado de firma
    const startDrawing = (e) => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const rect = canvas.getBoundingClientRect()
        
        ctx.beginPath()
        const x = e.clientX - rect.left || e.touches?.[0]?.clientX - rect.left
        const y = e.clientY - rect.top || e.touches?.[0]?.clientY - rect.top
        ctx.moveTo(x, y)
        setIsDrawing(true)
    }

    // Dibujar firma mientras se mueve el cursor/dedo
    const draw = (e) => {
        if (!isDrawing) return
        
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const rect = canvas.getBoundingClientRect()
        
        const x = e.clientX - rect.left || e.touches?.[0]?.clientX - rect.left
        const y = e.clientY - rect.top || e.touches?.[0]?.clientY - rect.top
        
        ctx.lineTo(x, y)
        ctx.stroke()
        setIsEmpty(false)
    }

    // Finalizar trazado y guardar firma
    const stopDrawing = () => {
        if (isDrawing) {
            const canvas = canvasRef.current
            const firmaDataUrl = canvas.toDataURL('image/png')
            onFirmaGuardada(firmaDataUrl)
        }
        setIsDrawing(false)
    }

    // Limpiar canvas
    const limpiar = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setIsEmpty(true)
        onFirmaGuardada(null)
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="w-full cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Dibuja tu firma con el mouse o dedo</p>
                {!isEmpty && (
                    <button
                        type="button"
                        onClick={limpiar}
                        className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                    >
                        Limpiar firma
                    </button>
                )}
            </div>
        </div>
    )
}

export default FirmaCanvas
