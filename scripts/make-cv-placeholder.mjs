/**
 * Genera el PDF provisorio del CV.
 *
 *   node scripts/make-cv-placeholder.mjs
 *
 * Existe por una sola razón: el botón "Descargar CV" está en el diseño, y un
 * link que da 404 es peor que un archivo que dice la verdad. Este PDF dice, en
 * la cara, que no es el CV y cómo reemplazarlo.
 *
 * Cuando pongas el PDF real en assets/brand/cv-nicolas-dalessandro.pdf,
 * cambiá `pending.cv` a false en content/shared.js y desaparecen los avisos
 * del sitio.
 *
 * PDF 1.4 a mano, sin dependencias. Helvetica es una de las 14 fuentes base:
 * no hay que embeber nada. WinAnsiEncoding cubre los acentos del español, así
 * que el archivo se escribe en latin1.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* [texto, tamaño, salto antes] */
const LINES = [
  ['Este no es el CV.', 17, 0],
  ['', 11, 6],
  ['Es un archivo provisorio para que el botón de descarga del sitio no', 11, 0],
  ['quede roto mientras no está cargado el PDF real.', 11, 0],
  ['', 11, 10],
  ['Para reemplazarlo:', 12, 0],
  ['', 11, 4],
  ['1.  Poné tu CV en  assets/brand/cv-nicolas-dalessandro.pdf', 11, 0],
  ['2.  Cambiá  pending.cv  a  false  en  content/shared.js', 11, 0],
  ['3.  Corré  node build.mjs', 11, 0],
  ['', 11, 10],
  ['El nombre del archivo se configura en content/shared.js, en site.cv.', 11, 0],
  ['', 11, 22],
  ['This is not the CV.', 13, 0],
  ['', 11, 6],
  ['It is a placeholder so the download button does not 404 while the real', 11, 0],
  ['PDF is missing. Drop yours at assets/brand/cv-nicolas-dalessandro.pdf,', 11, 0],
  ['set pending.cv to false in content/shared.js and run node build.mjs.', 11, 0],
];

/* En una cadena PDF hay que escapar la barra y los paréntesis. */
const pdfStr = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

function contentStream() {
  let y = 780;
  let out = 'BT\n';
  for (const [text, size, gap] of LINES) {
    y -= gap;
    if (text) {
      out += `/F1 ${size} Tf\n1 0 0 1 62 ${y} Tm\n(${pdfStr(text)}) Tj\n`;
    }
    y -= size + 5;
  }
  return out + 'ET\n';
}

function buildPdf() {
  const stream = contentStream();
  const objects = [
    `<</Type/Catalog/Pages 2 0 R>>`,
    `<</Type/Pages/Kids[3 0 R]/Count 1>>`,
    `<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]` +
      `/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>`,
    `<</Length ${Buffer.byteLength(stream, 'latin1')}>>\nstream\n${stream}endstream`,
    `<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>`,
    `<</Title(CV provisorio - Nicolas D'Alessandro)/Producer(portfolio4 build)>>`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefAt = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const o of offsets) pdf += `${String(o).padStart(10, '0')} 00000 n \n`;
  pdf +=
    `trailer\n<</Size ${objects.length + 1}/Root 1 0 R/Info ${objects.length} 0 R>>\n` +
    `startxref\n${xrefAt}\n%%EOF\n`;

  return Buffer.from(pdf, 'latin1');
}

const dest = join(ROOT, 'assets/brand/cv-nicolas-dalessandro.pdf');
await mkdir(dirname(dest), { recursive: true });
await writeFile(dest, buildPdf());
console.log(`escrito ${dest}`);
