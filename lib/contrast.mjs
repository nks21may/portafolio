/**
 * Contraste WCAG 2.1 en tiempo de build.
 *
 * Cada variante declara su paleta en sites/<variante>/tokens.mjs con dos mapas,
 * light y dark, y una lista de pares que tienen que pasar. Si alguno baja del
 * mínimo, el build FALLA. Es la única forma de que "accesible" no se degrade en
 * silencio la próxima vez que alguien retoque un color.
 *
 * Los colores con alpha (las hairlines, típicamente) se componen sobre su
 * fondo antes de medir, que es lo que efectivamente ve el ojo.
 */

/** Acepta #rgb, #rrggbb, #rrggbbaa y rgb()/rgba() en sintaxis vieja o nueva. */
export function parseColor(input) {
  const s = String(input).trim();

  const hex = s.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 6) h += 'ff';
    if (h.length !== 8) throw new Error(`Color hex no soportado: ${s}`);
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: parseInt(h.slice(6, 8), 16) / 255,
    };
  }

  const rgb = s.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean);
    const num = (v) => (v.endsWith('%') ? (parseFloat(v) / 100) * 255 : parseFloat(v));
    const alpha = (v) => (v === undefined ? 1 : v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v));
    return { r: num(parts[0]), g: num(parts[1]), b: num(parts[2]), a: alpha(parts[3]) };
  }

  throw new Error(`No sé leer el color: ${s}`);
}

/** Compone un color con alpha sobre un fondo opaco. */
export function composite(fg, bg) {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

export function luminance({ r, g, b }) {
  const ch = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

export function ratio(fgInput, bgInput) {
  const bg = parseColor(bgInput);
  if (bg.a < 1) throw new Error(`El fondo de una medición tiene que ser opaco: ${bgInput}`);
  const fg = composite(parseColor(fgInput), bg);
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Corre todos los pares en los dos temas y tira un error único con el informe
 * completo, para no arreglar de a un color por corrida.
 *
 * @param {string} variant
 * @param {{light: object, dark: object, checks: {fg:string,bg:string,min:number,label:string}[]}} tokens
 * @returns {{count: number, worst: {label: string, theme: string, value: number}}}
 */
export function auditPalette(variant, tokens) {
  const { light, dark, checks } = tokens;
  const problems = [];

  const lk = Object.keys(light).sort();
  const dk = Object.keys(dark).sort();
  if (lk.join('|') !== dk.join('|')) {
    const onlyLight = lk.filter((k) => !dk.includes(k));
    const onlyDark = dk.filter((k) => !lk.includes(k));
    problems.push(
      `las paletas claro y oscuro no tienen los mismos tokens` +
        (onlyLight.length ? ` — sólo en claro: ${onlyLight.join(', ')}` : '') +
        (onlyDark.length ? ` — sólo en oscuro: ${onlyDark.join(', ')}` : ''),
    );
  }

  let worst = { label: '', theme: '', value: Infinity };
  let count = 0;

  for (const [theme, palette] of [['claro', light], ['oscuro', dark]]) {
    for (const c of checks) {
      const fg = palette[c.fg];
      const bg = palette[c.bg];
      if (fg === undefined) { problems.push(`[${theme}] no existe el token "${c.fg}"`); continue; }
      if (bg === undefined) { problems.push(`[${theme}] no existe el token "${c.bg}"`); continue; }

      const r = ratio(fg, bg);
      count++;
      /* Un par con `text: false` se valida igual, pero queda afuera del "peor":
         son separadores y bordes, que se miden contra otro umbral y taparían
         el dato que importa en el resumen del build, que es el piso del texto. */
      if (c.text !== false && r < worst.value) worst = { label: c.label, theme, value: r };
      if (r < c.min) {
        problems.push(
          `[${theme}] ${c.label}: ${c.fg} sobre ${c.bg} da ${r.toFixed(2)}:1, ` +
            `necesita ${c.min}:1 (${fg} sobre ${bg})`,
        );
      }
    }
  }

  if (problems.length) {
    throw new Error(
      `Contraste insuficiente en "${variant}":\n  - ${problems.join('\n  - ')}\n` +
        `Corregí los tokens en sites/${variant}/tokens.mjs.`,
    );
  }

  return { count, worst };
}
