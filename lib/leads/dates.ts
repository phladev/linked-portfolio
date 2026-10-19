const TZ = 'America/Sao_Paulo'

/** Data de hoje (YYYY-MM-DD) no fuso de São Paulo, independente do fuso do servidor. */
export function todayISO(now: Date = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: TZ })
}

export function addDaysISO(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00-03:00`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toLocaleDateString('en-CA', { timeZone: TZ })
}

/** Instante em que o dia de hoje começou em São Paulo (sem horário de verão desde 2019). */
export function startOfTodaySP(now: Date = new Date()) {
  return new Date(`${todayISO(now)}T00:00:00-03:00`)
}

export function daysBetween(fromISO: string, toISO: string) {
  const a = new Date(`${fromISO}T12:00:00Z`).getTime()
  const b = new Date(`${toISO}T12:00:00Z`).getTime()
  return Math.round((b - a) / 86_400_000)
}

export function daysSince(
  date: Date | string | null | undefined,
  now = new Date(),
) {
  if (!date) return null
  const d = typeof date === 'string' ? new Date(date) : date
  return Math.floor((now.getTime() - d.getTime()) / 86_400_000)
}

const SHORT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  timeZone: TZ,
})

export function shortDate(iso: string | Date) {
  const d =
    typeof iso === 'string'
      ? new Date(iso.length === 10 ? `${iso}T12:00:00-03:00` : iso)
      : iso
  return SHORT.format(d).replace('.', '')
}

const LONG = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TZ,
})

export function dateTime(d: Date | string) {
  return LONG.format(typeof d === 'string' ? new Date(d) : d).replace('.', '')
}

/** "hoje", "amanhã", "há 2 dias", "em 3 dias" para uma data YYYY-MM-DD. */
export function relativeDay(iso: string, today = todayISO()) {
  const diff = daysBetween(today, iso)
  if (diff === 0) return 'hoje'
  if (diff === 1) return 'amanhã'
  if (diff === -1) return 'ontem'
  return diff < 0 ? `há ${-diff} dias` : `em ${diff} dias`
}
