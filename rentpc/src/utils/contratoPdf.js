// Util simple de generación de PDF usando jsPDF
// Genera un blob URL para previsualizar y descargar el contrato.
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// arrendador y arrendatario deben tener la forma:
// { razonSocial: string, rut: string, domicilio: string, contacto: { nombre, email, telefono } }
export function generarContratoPDF({ items, total, duracion, arrendador, arrendatario }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40; let y = margin;

  // Header
  doc.setFillColor(13, 116, 216); // azul
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 70, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Contrato de Arriendo de Equipos', margin, 45);

  // Datos generales
  y = 90;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, y);
  y += 18;

  // Partes del contrato
  doc.setFont('helvetica', 'bold');
  doc.text('Partes:', margin, y); y += 16;
  doc.setFont('helvetica', 'normal');
  const arrendadorLines = [
    `Arrendador: ${arrendador?.razonSocial || 'N/A'}`,
    `RUT: ${arrendador?.rut || 'N/A'}`,
    `Domicilio: ${arrendador?.domicilio || 'N/A'}`,
    `Contacto: ${arrendador?.contacto?.nombre || 'N/A'} — ${arrendador?.contacto?.email || 'N/A'} — ${arrendador?.contacto?.telefono || 'N/A'}`
  ];
  const arrendatarioLines = [
    `Arrendatario: ${arrendatario?.razonSocial || 'N/A'}`,
    `RUT: ${arrendatario?.rut || 'N/A'}`,
    `Domicilio: ${arrendatario?.domicilio || 'N/A'}`,
    `Contacto: ${arrendatario?.contacto?.nombre || 'N/A'} — ${arrendatario?.contacto?.email || 'N/A'} — ${arrendatario?.contacto?.telefono || 'N/A'}`
  ];
  arrendadorLines.forEach((t) => { doc.text(t, margin, y); y += 14; });
  y -= 56;
  arrendatarioLines.forEach((t) => { doc.text(t, 310, y); y += 14; });
  y += 10;

  // Resumen equipos (tabla profesional)
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen de equipos', margin, y); y += 10;
  autoTable(doc, {
    startY: y,
    head: [['Equipo', 'Cantidad', 'Precio unitario', 'Subtotal']],
    body: items.map((it) => [it.nombre, String(it.qty || 1), `$${it.precio || 0}`, `$${(it.precio || 0) * (it.qty || 1)}`]),
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    margin: { left: margin, right: margin },
  });
  y = doc.lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'bold');
  doc.text(`Total equipos: $${total}`, margin, y); y += 16;
  doc.setFont('helvetica', 'normal');
  doc.text(`Duración del arriendo: ${duracion?.valor || 1} ${duracion?.unidad || 'días'}`, margin, y);
  y += 24;

  // Cláusulas
  doc.setFont('helvetica', 'bold');
  doc.text('Términos y condiciones', margin, y); y += 14;
  doc.setFont('helvetica', 'normal');
  const tyc = [
    '1. Uso y cuidado: El arrendatario se compromete al buen uso y cuidado de los equipos.',
    '2. Daños: Cualquier daño por mal uso será responsabilidad del arrendatario.',
    '3. Entrega y retiro: Se coordinarán con el arrendador según disponibilidad y dirección indicada.',
    '4. Vigencia: La cotización es válida por 7 días desde su emisión.',
    '5. Pago: Las condiciones de pago se acordarán entre las partes y se podrán incluir garantías.',
    '6. Soporte: El arrendador brindará soporte técnico básico durante el periodo de arriendo.',
    '7. Devolución: Los equipos deben devolverse en el estado recibido, salvo desgaste razonable.'
  ];
  tyc.forEach((t) => {
    const lines = doc.splitTextToSize(t, 515);
    lines.forEach((l) => { doc.text(l, margin, y); y += 14; });
  });
  y += 18;

  // Firmas
  const w = doc.internal.pageSize.getWidth();
  doc.text('Firma Arrendador: ____________________________', margin, y);
  doc.text('Firma Arrendatario: ___________________________', w/2 + 10, y);

  // Footer
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(220);
  doc.line(margin, h - 50, w - margin, h - 50);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('Este documento constituye un borrador de contrato sujeto a validación y firma de las partes.', margin, h - 32);
  doc.text('© RENTPC', w - margin - 55, h - 32);

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  return url;
}
