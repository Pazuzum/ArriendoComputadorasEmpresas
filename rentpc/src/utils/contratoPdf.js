// Utilidad para generar PDF de contratos de arriendo usando jsPDF
// Genera un blob URL para previsualizar y descargar el contrato profesional

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Genera un PDF de contrato con los datos proporcionados
// arrendador y arrendatario deben tener: { razonSocial, rut, domicilio, contacto: { nombre, email, telefono } }
export function generarContratoPDF({ items, total, duracion, arrendador, arrendatario }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 50
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = margin

  // ========== ENCABEZADO EMPRESARIAL ==========
  // Barra superior con degradado simulado
  doc.setFillColor(13, 71, 161) // Azul oscuro profesional
  doc.rect(0, 0, pageWidth, 100, 'F')
  doc.setFillColor(21, 101, 192)
  doc.rect(0, 0, pageWidth, 80, 'F')
  
  // Logo y nombre de empresa
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(32)
  doc.text('RENTPC', margin, 50)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Arriendo Profesional de Equipos Computacionales', margin, 70)
  
  // Información de contacto en esquina superior derecha
  doc.setFontSize(9)
  const contactoY = 40
  doc.text('+56 9 5447 6887', pageWidth - margin - 110, contactoY, { align: 'right' })
  doc.text('contacto@rentpc.cl', pageWidth - margin - 110, contactoY + 15, { align: 'right' })
  doc.text('www.rentpc.cl', pageWidth - margin - 110, contactoY + 30, { align: 'right' })

  // ========== TÍTULO DEL DOCUMENTO ==========
  y = 130
  doc.setTextColor(13, 71, 161)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('CONTRATO DE ARRIENDO DE EQUIPOS', pageWidth / 2, y, { align: 'center' })
  
  // Número de contrato y fecha
  y += 25
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'normal')
  const numeroContrato = `RC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`
  doc.text(`N° de Contrato: ${numeroContrato}`, pageWidth / 2, y, { align: 'center' })
  
  y += 15
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, y, { align: 'center' })
  
  // Línea decorativa
  y += 15
  doc.setDrawColor(13, 71, 161)
  doc.setLineWidth(2)
  doc.line(margin, y, pageWidth - margin, y)
  
  y += 25

  // ========== PARTES DEL CONTRATO ==========
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(13, 71, 161)
  doc.text('PARTES CONTRATANTES', margin, y)
  y += 20
  
  // Tarjeta del Cliente (Arrendatario)
  doc.setFillColor(245, 248, 255)
  doc.roundedRect(margin, y, 240, 110, 5, 5, 'F')
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(13, 71, 161)
  doc.text('EL ARRENDATARIO', margin + 10, y + 18)
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(60, 60, 60)
  doc.text('Razón Social:', margin + 10, y + 36)
  doc.setFont('helvetica', 'normal')
  doc.text(arrendatario?.razonSocial || 'N/A', margin + 10, y + 48)
  
  doc.setFont('helvetica', 'bold')
  doc.text('RUT:', margin + 10, y + 62)
  doc.setFont('helvetica', 'normal')
  doc.text(arrendatario?.rut || 'N/A', margin + 10, y + 74)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Representante:', margin + 10, y + 88)
  doc.setFont('helvetica', 'normal')
  doc.text(arrendatario?.contacto?.nombre || 'N/A', margin + 10, y + 100)
  
  // Tarjeta de RENTPC (Arrendador)
  doc.setFillColor(13, 71, 161)
  doc.roundedRect(pageWidth - margin - 240, y, 240, 110, 5, 5, 'F')
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('EL ARRENDADOR', pageWidth - margin - 230, y + 18)
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Razón Social:', pageWidth - margin - 230, y + 36)
  doc.setFont('helvetica', 'normal')
  doc.text(arrendador?.razonSocial || 'RENTPC', pageWidth - margin - 230, y + 48)
  
  doc.setFont('helvetica', 'bold')
  doc.text('RUT:', pageWidth - margin - 230, y + 62)
  doc.setFont('helvetica', 'normal')
  doc.text(arrendador?.rut || '21.080.205-3', pageWidth - margin - 230, y + 74)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Domicilio:', pageWidth - margin - 230, y + 88)
  doc.setFont('helvetica', 'normal')
  doc.text(arrendador?.domicilio || 'Hanga Roa 1249', pageWidth - margin - 230, y + 100)
  
  y += 130
  doc.setTextColor(0, 0, 0)

  // ========== DETALLE DE EQUIPOS ==========
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(13, 71, 161)
  doc.text('DETALLE DE EQUIPOS ARRENDADOS', margin, y)
  y += 15
  
  autoTable(doc, {
    startY: y,
    head: [['Descripción del Equipo', 'Cant.', 'Precio/día', 'Subtotal']],
    body: items.map((it) => [
      it.nombre,
      String(it.qty || 1),
      `$${(it.precio || 0).toLocaleString('es-CL')}`,
      `$${((it.precio || 0) * (it.qty || 1)).toLocaleString('es-CL')}`
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 8,
      lineColor: [220, 220, 220],
      lineWidth: 0.5
    },
    headStyles: {
      fillColor: [13, 71, 161],
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center', cellWidth: 50 },
      2: { halign: 'right', cellWidth: 80 },
      3: { halign: 'right', cellWidth: 90, fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: margin, right: margin }
  })
  
  // ========== RESUMEN FINANCIERO ==========
  y = doc.lastAutoTable.finalY + 15
  
  // Caja de resumen con fondo
  const boxHeight = 90
  doc.setFillColor(245, 248, 255)
  doc.roundedRect(pageWidth - margin - 220, y, 220, boxHeight, 5, 5, 'F')
  doc.setDrawColor(13, 71, 161)
  doc.setLineWidth(1)
  doc.roundedRect(pageWidth - margin - 220, y, 220, boxHeight, 5, 5, 'S')
  
  let summaryY = y + 20
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  
  doc.text('Subtotal Equipos:', pageWidth - margin - 210, summaryY)
  doc.setFont('helvetica', 'bold')
  doc.text(`$${(total / (duracion?.valor || 1)).toLocaleString('es-CL')}`, pageWidth - margin - 20, summaryY, { align: 'right' })
  
  summaryY += 18
  doc.setFont('helvetica', 'normal')
  doc.text('Duración del Arriendo:', pageWidth - margin - 210, summaryY)
  doc.setFont('helvetica', 'bold')
  doc.text(`${duracion?.valor || 1} ${duracion?.unidad === 'dias' ? 'días' : duracion?.unidad || 'días'}`, pageWidth - margin - 20, summaryY, { align: 'right' })
  
  summaryY += 18
  doc.setDrawColor(13, 71, 161)
  doc.setLineWidth(0.5)
  doc.line(pageWidth - margin - 210, summaryY, pageWidth - margin - 20, summaryY)
  
  summaryY += 18
  doc.setFontSize(12)
  doc.setTextColor(13, 71, 161)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL A PAGAR:', pageWidth - margin - 210, summaryY)
  doc.setFontSize(14)
  doc.text(`$${total.toLocaleString('es-CL')}`, pageWidth - margin - 20, summaryY, { align: 'right' })
  
  y += boxHeight + 25
  doc.setTextColor(0, 0, 0)

  // ========== TÉRMINOS Y CONDICIONES ==========
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(13, 71, 161)
  doc.text('TÉRMINOS Y CONDICIONES DEL CONTRATO', margin, y)
  y += 18
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(40, 40, 40)
  
  const clausulas = [
    {
      titulo: 'PRIMERA: OBJETO DEL CONTRATO',
      texto: 'El arrendador se obliga a entregar al arrendatario los equipos computacionales detallados en el presente contrato, en perfectas condiciones de funcionamiento, para su uso durante el periodo acordado.'
    },
    {
      titulo: 'SEGUNDA: OBLIGACIONES DEL ARRENDATARIO',
      texto: 'El arrendatario se compromete a: (a) Usar los equipos con el debido cuidado y exclusivamente para fines lícitos; (b) No realizar modificaciones físicas o de software sin autorización; (c) Mantener los equipos en un ambiente adecuado; (d) Informar inmediatamente cualquier falla o desperfecto.'
    },
    {
      titulo: 'TERCERA: RESPONSABILIDAD POR DAÑOS',
      texto: 'El arrendatario será responsable de cualquier daño, pérdida, robo o deterioro de los equipos durante el periodo de arriendo, debiendo reembolsar el valor comercial actualizado o el costo de reparación según corresponda.'
    },
    {
      titulo: 'CUARTA: ENTREGA Y DEVOLUCIÓN',
      texto: 'La entrega y retiro de los equipos se coordinará entre las partes. El arrendatario deberá devolver los equipos en las mismas condiciones en que los recibió, salvo el desgaste normal por uso adecuado.'
    },
    {
      titulo: 'QUINTA: PAGO Y GARANTÍAS',
      texto: `El arrendatario se obliga a pagar la suma total de $${total.toLocaleString('es-CL')} según las condiciones acordadas. El arrendador podrá solicitar garantías adicionales a su criterio.`
    },
    {
      titulo: 'SEXTA: SOPORTE TÉCNICO',
      texto: 'El arrendador proporcionará soporte técnico básico durante el periodo de arriendo, sin costo adicional, para resolver problemas de funcionamiento no causados por mal uso.'
    },
    {
      titulo: 'SÉPTIMA: VIGENCIA Y TÉRMINO',
      texto: `Este contrato tiene una vigencia de ${duracion?.valor || 1} ${duracion?.unidad === 'dias' ? 'días' : duracion?.unidad || 'días'} desde la entrega de los equipos. El incumplimiento de las obligaciones faculta al arrendador para dar término anticipado al contrato.`
    }
  ]
  
  clausulas.forEach((clausula) => {
    // Verificar si necesitamos una nueva página
    if (y > doc.internal.pageSize.getHeight() - 120) {
      doc.addPage()
      y = margin
    }
    
    doc.setFont('helvetica', 'bold')
    doc.text(clausula.titulo, margin, y)
    y += 12
    
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(clausula.texto, pageWidth - (margin * 2))
    lines.forEach((line) => {
      if (y > doc.internal.pageSize.getHeight() - 100) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 11
    })
    y += 8
  })
  
  y += 20

  // ========== SECCIÓN DE FIRMAS ==========
  // Verificar si necesitamos nueva página para firmas
  if (y > doc.internal.pageSize.getHeight() - 180) {
    doc.addPage()
    y = margin + 40
  }
  
  doc.setDrawColor(13, 71, 161)
  doc.setLineWidth(1)
  doc.line(margin, y, pageWidth - margin, y)
  y += 25
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(13, 71, 161)
  doc.text('FIRMAS Y ACEPTACIÓN', margin, y)
  y += 25
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  doc.text('Las partes declaran haber leído y comprendido todas las cláusulas del presente contrato, manifestando su', margin, y)
  y += 12
  doc.text('conformidad mediante las firmas que suscriben al pie.', margin, y)
  y += 35
  
  // Espacios para firmas lado a lado
  const firmaWidth = 200
  const firmaSpacing = (pageWidth - (margin * 2) - (firmaWidth * 2)) / 3
  const firmaLeft = margin + firmaSpacing
  const firmaRight = margin + firmaSpacing + firmaWidth + firmaSpacing
  
  // Líneas de firma
  doc.setDrawColor(100, 100, 100)
  doc.setLineWidth(1)
  doc.line(firmaLeft, y, firmaLeft + firmaWidth, y)
  doc.line(firmaRight, y, firmaRight + firmaWidth, y)
  
  y += 15
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text('ARRENDATARIO', firmaLeft + firmaWidth / 2, y, { align: 'center' })
  doc.text('ARRENDADOR', firmaRight + firmaWidth / 2, y, { align: 'center' })
  
  y += 12
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(arrendatario?.razonSocial || 'N/A', firmaLeft + firmaWidth / 2, y, { align: 'center' })
  doc.text(arrendador?.razonSocial || 'RENTPC', firmaRight + firmaWidth / 2, y, { align: 'center' })
  
  y += 10
  doc.text(`RUT: ${arrendatario?.rut || 'N/A'}`, firmaLeft + firmaWidth / 2, y, { align: 'center' })
  doc.text(`RUT: ${arrendador?.rut || '21.080.205-3'}`, firmaRight + firmaWidth / 2, y, { align: 'center' })

  // ========== PIE DE PÁGINA ==========
  const pageHeight = doc.internal.pageSize.getHeight()
  const totalPages = doc.internal.getNumberOfPages()
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    
    // Línea superior del pie
    doc.setDrawColor(13, 71, 161)
    doc.setLineWidth(2)
    doc.line(margin, pageHeight - 60, pageWidth - margin, pageHeight - 60)
    
    // Texto del pie
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'italic')
    doc.text('Este documento constituye un contrato legalmente vinculante entre las partes.', margin, pageHeight - 42)
    doc.text('Para consultas o soporte: contacto@rentpc.cl | +56 9 5447 6887', margin, pageHeight - 32)
    
    doc.setFont('helvetica', 'bold')
    doc.text(`(c) ${new Date().getFullYear()} RENTPC - Todos los derechos reservados`, pageWidth - margin, pageHeight - 42, { align: 'right' })
    doc.text(`Pagina ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 32, { align: 'right' })
  }

  // Generar blob URL para preview/descarga
  const blob = doc.output('blob')
  const url = URL.createObjectURL(blob)
  return url
}
