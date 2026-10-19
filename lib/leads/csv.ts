/** Leitor de CSV pequeno e tolerante: aspas, vírgula ou ponto e vírgula, quebras de linha. */
export function parseCsv(text: string): string[][] {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  const firstLine = src.split(/\r?\n/, 1)[0] ?? ''
  const delim =
    (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0)
      ? ';'
      : ','

  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          cell += '"'
          i++
        } else quoted = false
      } else cell += c
    } else if (c === '"') quoted = true
    else if (c === delim) {
      row.push(cell)
      cell = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(cell)
      cell = ''
      if (row.some((v) => v.trim() !== '')) rows.push(row)
      row = []
    } else cell += c
  }
  row.push(cell)
  if (row.some((v) => v.trim() !== '')) rows.push(row)
  return rows
}

export type ImportField =
  | 'name'
  | 'city'
  | 'phone'
  | 'instagram'
  | 'website'
  | 'email'

const GUESS: Record<ImportField, RegExp> = {
  name: /^(nome|name|title|titulo|título|empresa|neg[oó]cio|raz[aã]o)/i,
  phone: /(telefone|phone|whats|celular|fone)/i,
  city: /(cidade|city|munic[ií]pio)/i,
  website: /(site|website|web|url)/i,
  instagram: /instagram/i,
  email: /(e-?mail)/i,
}

/** Sugere qual coluna do arquivo corresponde a cada campo do lead. */
export function guessMapping(headers: string[]) {
  const map: Partial<Record<ImportField, number>> = {}
  for (const field of Object.keys(GUESS) as ImportField[]) {
    const idx = headers.findIndex(
      (h, i) => GUESS[field].test(h.trim()) && !Object.values(map).includes(i),
    )
    if (idx >= 0) map[field] = idx
  }
  return map
}
