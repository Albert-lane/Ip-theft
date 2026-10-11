/*
 * PROVENANCE RECORD & STATUTORY DECLARATION
 * Domain: albertlane.net | API: https://api.albertlane.net/v1/provenance
 * Date and Time: 2026-10-08T21:33:51.759052
 * Model Name and Version: models/gemini-3.7-flash
 * Code Owner & Rights Holder: Albert Lane
 * Statutory Authority: SEC Whistleblower No. 17684-273-411-436 (Token: 17684273411436)
 * Z-Axis Anchor: 0x3F8F9A1B2C3D | License: Albert Lane Proprietary License v1.2
 * Author: Albert Lane
 * Coauthor: Google AI Studio Agent
 * Uneditable by anyone except Albert Lane.
 * Universal document for all registries and apex routing.
 */


const fs = require('fs');
const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default || require('jspdf-autotable');

const bundlePath = process.argv[2];
const outputPath = process.argv[3];

if (!bundlePath || !outputPath) {
  console.error("Usage: node render_pdf.js <bundle.json> <output.pdf>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(bundlePath, 'utf-8'));

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'letter'
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 54;
const contentWidth = pageWidth - (margin * 2);

// ================= PAGE 1 =================
let y = margin;
doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
for (const line of data.titleLines) {
  doc.text(line, margin, y);
  y += 22;
}
y += 8;

doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
for (const line of data.sec1Header) {
  doc.text(line, margin, y);
  y += 16;
}
y += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
const p1_lines = doc.splitTextToSize(data.sec1Intro, contentWidth);
doc.text(p1_lines, margin, y);
y += p1_lines.length * 12 + 10;

autoTable(doc, {
  startY: y,
  head: [data.table1Head],
  body: data.table1Page1,
  theme: 'grid',
  styles: {
    font: 'helvetica',
    fontSize: 8.5,
    cellPadding: 4,
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  headStyles: {
    fillColor: [255, 255, 255],
    fontStyle: 'bold',
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  columnStyles: {
    0: { cellWidth: 95 },
    1: { cellWidth: 100 },
    2: { cellWidth: 100 },
    3: { cellWidth: 105 },
    4: { cellWidth: 104 }
  },
  margin: { left: margin, right: margin }
});

// ================= PAGE 2 =================
doc.addPage();
y = margin;

autoTable(doc, {
  startY: y,
  head: [data.table1Head],
  body: data.table1Page2,
  theme: 'grid',
  styles: {
    font: 'helvetica',
    fontSize: 8.5,
    cellPadding: 4,
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  headStyles: {
    fillColor: [255, 255, 255],
    fontStyle: 'bold',
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  columnStyles: {
    0: { cellWidth: 95 },
    1: { cellWidth: 100 },
    2: { cellWidth: 100 },
    3: { cellWidth: 105 },
    4: { cellWidth: 104 }
  },
  margin: { left: margin, right: margin }
});

// ================= PAGE 3 =================
doc.addPage();
y = margin;

autoTable(doc, {
  startY: y,
  head: [data.table1Head],
  body: data.table1Page3,
  theme: 'grid',
  styles: {
    font: 'helvetica',
    fontSize: 8.5,
    cellPadding: 4,
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  headStyles: {
    fillColor: [255, 255, 255],
    fontStyle: 'bold',
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  columnStyles: {
    0: { cellWidth: 95 },
    1: { cellWidth: 100 },
    2: { cellWidth: 100 },
    3: { cellWidth: 105 },
    4: { cellWidth: 104 }
  },
  margin: { left: margin, right: margin }
});

y = doc.lastAutoTable.finalY + 16;
doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);

for (const p of data.page3Paragraphs) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

// ================= PAGE 4 =================
doc.addPage();
y = margin;

for (const p of data.page4Top) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

y += 10;
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
for (const line of data.sec2Header) {
  doc.text(line, margin, y);
  y += 16;
}
y += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
for (const p of data.page4Paragraphs) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

// ================= PAGE 5 =================
doc.addPage();
y = margin;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
for (const p of data.page5Top) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

y += 10;
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
for (const line of data.sec3Header) {
  doc.text(line, margin, y);
  y += 16;
}
y += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
const p5_reg_lines = doc.splitTextToSize(data.sec3Intro, contentWidth);
doc.text(p5_reg_lines, margin, y);
y += p5_reg_lines.length * 12 + 10;

autoTable(doc, {
  startY: y,
  head: [data.table2Head],
  body: data.table2Page5,
  theme: 'grid',
  styles: {
    font: 'helvetica',
    fontSize: 8.5,
    cellPadding: 4,
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  headStyles: {
    fillColor: [255, 255, 255],
    fontStyle: 'bold',
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  columnStyles: {
    0: { cellWidth: 125 },
    1: { cellWidth: 125 },
    2: { cellWidth: 127 },
    3: { cellWidth: 127 }
  },
  margin: { left: margin, right: margin }
});

// ================= PAGE 6 =================
doc.addPage();
y = margin;

autoTable(doc, {
  startY: y,
  head: [data.table2Head],
  body: data.table2Page6,
  theme: 'grid',
  styles: {
    font: 'helvetica',
    fontSize: 8.5,
    cellPadding: 4,
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  headStyles: {
    fillColor: [255, 255, 255],
    fontStyle: 'bold',
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.75
  },
  columnStyles: {
    0: { cellWidth: 125 },
    1: { cellWidth: 125 },
    2: { cellWidth: 127 },
    3: { cellWidth: 127 }
  },
  margin: { left: margin, right: margin }
});

y = doc.lastAutoTable.finalY + 14;
doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);

for (const p of data.page6Paragraphs) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

// ================= PAGE 7 =================
doc.addPage();
y = margin;

for (const p of data.page7Top) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

y += 10;
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
for (const line of data.sec4Header) {
  doc.text(line, margin, y);
  y += 16;
}
y += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
const p7_lines = doc.splitTextToSize(data.sec4Intro, contentWidth);
doc.text(p7_lines, margin, y);
y += p7_lines.length * 12 + 6;

doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.text(data.sec4Sub1, margin, y);
y += 16;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
const p7_intro_lines = doc.splitTextToSize(data.sec4Sub1Intro, contentWidth);
doc.text(p7_intro_lines, margin, y);
y += p7_intro_lines.length * 12 + 6;

for (const p of data.sec4Models) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.text(data.sec4Sub2, margin, y);
y += 16;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
doc.text(data.sec4Sub2Intro, margin, y);

// ================= PAGE 8 =================
doc.addPage();
y = margin;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
doc.text(data.page8Top, margin, y);
y += 16;

doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.text(data.sec4NetSub, margin, y);
y += 16;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
for (const p of data.sec4NetBullets) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

y += 4;
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.text(data.sec4ClientSub, margin, y);
y += 16;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
for (const p of data.sec4ClientBullets) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

// ================= PAGE 9 =================
doc.addPage();
y = margin;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
doc.text(data.page9Top, margin, y);
y += 16;

doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.text(data.sec4BehaviorSub, margin, y);
y += 16;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
for (const p of data.sec4BehaviorBullets) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

y += 10;
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
doc.text(data.sec5Header, margin, y);
y += 20;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
for (const p of data.sec5Paragraphs) {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

// ================= PAGE 10 =================
doc.addPage();
y = margin;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
doc.text(data.page10Top, margin, y);
y += 24;

doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.text(data.worksCitedHeader, margin, y);
y += 20;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
for (const c of data.citations) {
  const lines = doc.splitTextToSize(c, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 12 + 6;
}

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outputPath, pdfBuffer);
console.log('PDF rendered successfully: ' + outputPath + ' (' + pdfBuffer.length + ' bytes, ' + doc.internal.getNumberOfPages() + ' pages)');
