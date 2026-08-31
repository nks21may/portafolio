/**
 * Helpers de escapado y formato. Los usan las tres variantes.
 *
 * Regla: TODO lo que venga de content/ pasa por esc() o richText() antes de
 * entrar al HTML. richText() es la única puerta que deja pasar un tag, y sólo
 * <code>, porque los highlights lo traen escrito a mano.
 */

export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Igual que esc(): separado sólo para que se lea la intención en el template. */
export const attr = esc;

/** Escapa todo y después devuelve <code> a la vida. */
export const richText = (s) =>
  esc(s).replace(/&lt;code&gt;/g, '<code>').replace(/&lt;\/code&gt;/g, '</code>');

/** ISO 8601 para <time datetime>. Un período abierto es sólo el inicio. */
export const iso = (p) => (p && p.end ? `${p.start}/${p.end}` : p && p.start ? p.start : '');

/** Junta clases descartando falsy, para no emitir class=" ". */
export const cx = (...xs) => xs.filter(Boolean).join(' ');

/** Minificador conservador de CSS: sirve para inlinear sin ensuciar el HTML. */
export function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

/**
 * Minificador conservador de JS: saca indentación, líneas en blanco y las
 * líneas que son sólo comentario. Une con \n a propósito — unir sin separador
 * rompe en cuanto una sentencia no termina en punto y coma.
 */
export function minifyJs(js) {
  return js
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//'))
    .join('\n');
}
