import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  pgEnum,
  date,
  index,
} from 'drizzle-orm/pg-core'

export const projectStatus = pgEnum('project_status', [
  'in_progress',
  'completed',
  'archived',
])

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  coverUrl: text('cover_url'),
  tags: text('tags').array().notNull().default([]),
  repoUrl: text('repo_url'),
  deployUrl: text('deploy_url'),
  status: projectStatus('status').notNull().default('in_progress'),
  published: boolean('published').notNull().default(false),
  featured: boolean('featured').notNull().default(false),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const siteContent = pgTable('site_content', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const activityLog = pgTable('activity_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: uuid('entity_id'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// ---------------------------------------------------------------------------
// Painel de prospecção
// ---------------------------------------------------------------------------

export const leadStage = pgEnum('lead_stage', [
  'novo',
  'contatado',
  'demo_enviada',
  'respondeu',
  'reuniao',
  'proposta',
  'fechado',
  'perdido',
])

export const leadNiche = pgEnum('lead_niche', [
  'advocacia',
  'clinica',
  'imobiliaria',
  'restaurante',
  'academia',
  'barbearia',
  'outro',
])

export const leadSource = pgEnum('lead_source', [
  'google',
  'maps',
  'instagram',
  'anuncios',
  'indicacao',
  'outro',
])

export const siteQuality = pgEnum('site_quality', [
  'desconhecido',
  'nenhum',
  'fraco',
  'bom',
])

export const interactionType = pgEnum('interaction_type', [
  'whatsapp',
  'ligacao',
  'email',
  'instagram',
  'reuniao',
  'nota',
  'etapa',
])

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    niche: leadNiche('niche').notNull().default('outro'),
    city: text('city'),
    contactName: text('contact_name'),
    phone: text('phone'),
    instagram: text('instagram'),
    website: text('website'),
    email: text('email'),
    source: leadSource('source').notNull().default('outro'),
    stage: leadStage('stage').notNull().default('novo'),
    siteQuality: siteQuality('site_quality').notNull().default('desconhecido'),
    runsAds: boolean('runs_ads').notNull().default(false),
    demoSlug: text('demo_slug'),
    nextActionAt: date('next_action_at', { mode: 'string' }),
    nextActionNote: text('next_action_note'),
    valueEstimate: integer('value_estimate'),
    lostReason: text('lost_reason'),
    notes: text('notes'),
    lastContactAt: timestamp('last_contact_at', { withTimezone: true }),
    stageChangedAt: timestamp('stage_changed_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('leads_stage_idx').on(t.stage),
    index('leads_next_action_idx').on(t.nextActionAt),
  ],
)

export const leadInteractions = pgTable(
  'lead_interactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    leadId: uuid('lead_id')
      .notNull()
      .references(() => leads.id, { onDelete: 'cascade' }),
    type: interactionType('type').notNull(),
    content: text('content').notNull().default(''),
    demoSlug: text('demo_slug'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('lead_interactions_lead_idx').on(t.leadId, t.createdAt)],
)

export const messageTemplates = pgTable('message_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  niche: leadNiche('niche'),
  body: text('body').notNull(),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const demos = pgTable('demos', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  niche: leadNiche('niche'),
  url: text('url').notNull(),
  note: text('note'),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
