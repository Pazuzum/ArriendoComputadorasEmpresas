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

    // Obtener coordenadas correctas del canvas considerando la escala
    const getCanvasCoordinates = (e) => {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        
        // Obtener las coordenadas del evento (mouse o touch)
        let clientX, clientY
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = e.clientX
            clientY = e.clientY
        }
        
        // Calcular la escala entre el tamaño renderizado y el tamaño real del canvas
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        
        // Convertir coordenadas de píxeles de pantalla a píxeles del canvas
        const x = (clientX - rect.left) * scaleX
        const y = (clientY - rect.top) * scaleY
        
        return { x, y }
    }

    // Iniciar trazado de firma
    const startDrawing = (e) => {
        e.preventDefault()
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const { x, y } = getCanvasCoordinates(e)
        
        ctx.beginPath()
        ctx.moveTo(x, y)
        setIsDrawing(true)
    }

    // Dibujar firma mientras se mueve el cursor/dedo
    const draw = (e) => {
        if (!isDrawing) return
        e.preventDefault()
        
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const { x, y } = getCanvasCoordinates(e)
        
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
                    width={600}
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
