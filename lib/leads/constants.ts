export const STAGES = [
  { id: 'novo', label: 'Novo' },
  { id: 'contatado', label: 'Contatado' },
  { id: 'demo_enviada', label: 'Demo enviada' },
  { id: 'respondeu', label: 'Respondeu' },
  { id: 'reuniao', label: 'Reunião' },
  { id: 'proposta', label: 'Proposta' },
  { id: 'fechado', label: 'Fechado' },
  { id: 'perdido', label: 'Perdido' },
] as const

export type StageId = (typeof STAGES)[number]['id']

export const STAGE_LABEL = Object.fromEntries(
  STAGES.map((s) => [s.id, s.label]),
) as Record<StageId, string>

/** Etapas em que o lead ainda está em andamento. */
export const ACTIVE_STAGES: StageId[] = [
  'novo',
  'contatado',
  'demo_enviada',
  'respondeu',
  'reuniao',
  'proposta',
]

/** A partir daqui o lead já respondeu: base da taxa de resposta. */
export const RESPONDED_STAGES: StageId[] = [
  'respondeu',
  'reuniao',
  'proposta',
  'fechado',
]

export const NICHES = [
  { id: 'advocacia', label: 'Advocacia' },
  { id: 'clinica', label: 'Clínica' },
  { id: 'imobiliaria', label: 'Imobiliária' },
  { id: 'restaurante', label: 'Restaurante' },
  { id: 'academia', label: 'Academia' },
  { id: 'barbearia', label: 'Barbearia' },
  { id: 'outro', label: 'Outro' },
] as const

export type NicheId = (typeof NICHES)[number]['id']

export const NICHE_LABEL = Object.fromEntries(
  NICHES.map((n) => [n.id, n.label]),
) as Record<NicheId, string>

export const SOURCES = [
  { id: 'google', label: 'Google' },
  { id: 'maps', label: 'Google Maps' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'anuncios', label: 'Biblioteca de anúncios' },
  { id: 'indicacao', label: 'Indicação' },
  { id: 'outro', label: 'Outro' },
] as const

export type SourceId = (typeof SOURCES)[number]['id']

export const SOURCE_LABEL = Object.fromEntries(
  SOURCES.map((s) => [s.id, s.label]),
) as Record<SourceId, string>

export const SITE_QUALITIES = [
  { id: 'desconhecido', label: 'Não sei' },
  { id: 'nenhum', label: 'Sem site' },
  { id: 'fraco', label: 'Site fraco' },
  { id: 'bom', label: 'Site bom' },
] as const

export type SiteQualityId = (typeof SITE_QUALITIES)[number]['id']

export const SITE_QUALITY_LABEL = Object.fromEntries(
  SITE_QUALITIES.map((s) => [s.id, s.label]),
) as Record<SiteQualityId, string>

export const INTERACTION_TYPES = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'ligacao', label: 'Ligação' },
  { id: 'email', label: 'E-mail' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'reuniao', label: 'Reunião' },
  { id: 'nota', label: 'Nota' },
] as const

export type InteractionTypeId =
  | (typeof INTERACTION_TYPES)[number]['id']
  | 'etapa'

export const INTERACTION_LABEL: Record<InteractionTypeId, string> = {
  whatsapp: 'WhatsApp',
  ligacao: 'Ligação',
  email: 'E-mail',
  instagram: 'Instagram',
  reuniao: 'Reunião',
  nota: 'Nota',
  etapa: 'Etapa',
}

/** Tipos que contam como "contato feito" na meta diária. */
export const CONTACT_TYPES: InteractionTypeId[] = [
  'whatsapp',
  'ligacao',
  'email',
  'instagram',
  'reuniao',
]

/** Dias sem contato para um lead ativo ser considerado "esfriando". */
export const COOLING_DAYS = 5
export const FOLLOW_UP_DAYS = 3
export const DEFAULT_DAILY_GOAL = 10
