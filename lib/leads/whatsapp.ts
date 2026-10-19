/** Normaliza para o formato internacional do WhatsApp (55 + DDD + número). */
export function normalizePhone(phone: string | null | undefined) {
  if (!phone) return null
  let digits = phone.replace(/\D/g, '')
  digits = digits.replace(/^0+/, '')
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`
  if (digits.length < 12 || digits.length > 13) return null
  return digits
}

export function waLink(phone: string | null | undefined, text?: string) {
  const n = normalizePhone(phone)
  if (!n) return null
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export type TemplateVars = {
  nome: string
  cidade?: string | null
  contato?: string | null
  demo_url?: string | null
}

/** Troca {{nome}}, {{cidade}}, {{contato}} e {{demo_url}}; variável ausente vira vazio. */
export function fillTemplate(body: string, vars: TemplateVars) {
  return body
    .replace(/\{\{\s*nome\s*\}\}/g, vars.nome)
    .replace(/\{\{\s*cidade\s*\}\}/g, vars.cidade ?? 'sua cidade')
    .replace(/\{\{\s*contato\s*\}\}/g, vars.contato ?? vars.nome)
    .replace(/\{\{\s*demo_url\s*\}\}/g, vars.demo_url ?? '')
    .replace(/[ \t]+\n/g, '\n')
    .trim()
}

/** Sugere o link de Instagram a partir de @usuario ou URL. */
export function instagramUrl(value: string | null | undefined) {
  if (!value) return null
  const v = value.trim()
  if (/^https?:\/\//i.test(v)) return v
  return `https://instagram.com/${v.replace(/^@/, '')}`
}

export function websiteUrl(value: string | null | undefined) {
  if (!value) return null
  const v = value.trim()
  return /^https?:\/\//i.test(v) ? v : `https://${v}`
}
