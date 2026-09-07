/**
 * Resaltado del bloque de Python del proyecto destacado.
 *
 * Es un tokenizador mínimo a propósito: el fragmento es ilustrativo, corto y
 * lo escribimos nosotros en content/shared.js. No es un resaltador general y
 * no pretende serlo — meter uno de verdad sería una dependencia entera para
 * seis líneas de código.
 *
 * Clases emitidas, que la hoja de estilos pinta:
 *   tok-c comentario · tok-s cadena · tok-k palabra clave
 *   tok-f llamada a función · tok-n número
 */

import { esc } from './html.mjs';

const KEYWORDS =
  'def|for|if|in|return|yield|continue|not|and|or|None|True|False|class|import|from|elif|else|while|with|as|pass|raise|try|except|finally|lambda';

const TOKEN = new RegExp(
  [
    `(#[^\\n]*)`, // 1 comentario
    `("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`, // 2 cadena
    `\\b(${KEYWORDS})\\b`, // 3 palabra clave
    `\\b([A-Za-z_]\\w*)(?=\\s*\\()`, // 4 función invocada
    `\\b(\\d+)\\b`, // 5 número
  ].join('|'),
  'g',
);

const CLASS = { 1: 'tok-c', 2: 'tok-s', 3: 'tok-k', 4: 'tok-f', 5: 'tok-n' };

/** Devuelve HTML ya escapado, con los tokens envueltos en <span>. */
export function highlightPython(source) {
  let out = '';
  let last = 0;

  for (const m of source.matchAll(TOKEN)) {
    out += esc(source.slice(last, m.index));
    const group = [1, 2, 3, 4, 5].find((i) => m[i] !== undefined);
    out += `<span class="${CLASS[group]}">${esc(m[group])}</span>`;
    last = m.index + m[0].length;
  }

  return out + esc(source.slice(last));
}
