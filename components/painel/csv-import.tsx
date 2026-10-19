'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { FileUp } from 'lucide-react'
import { importLeads } from '@/app/admin/(painel)/leads/actions'
import { guessMapping, parseCsv, type ImportField } from '@/lib/leads/csv'
import {
  NICHES,
  SOURCES,
  type NicheId,
  type SourceId,
} from '@/lib/leads/constants'
import { Btn, Empty, Field, buttonCls, inputCls } from './ui'

const FIELDS: { id: ImportField; label: string; required?: boolean }[] = [
  { id: 'name', label: 'Nome do negócio', required: true },
  { id: 'phone', label: 'Telefone / WhatsApp' },
  { id: 'city', label: 'Cidade' },
  { id: 'website', label: 'Site' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'email', label: 'E-mail' },
]

export function CsvImport() {
  const router = useRouter()
  const [rows, setRows] = useState<string[][]>([])
  const [map, setMap] = useState<Partial<Record<ImportField, number>>>({})
  const [niche, setNiche] = useState<NicheId>('advocacia')
  const [source, setSource] = useState<SourceId>('maps')
  const [schedule, setSchedule] = useState(true)
  const [pasteMode, setPasteMode] = useState(false)
  const [paste, setPaste] = useState('')
  const [pending, start] = useTransition()
  const [result, setResult] = useState<{
    imported: number
    skipped: number
    invalid: number
  } | null>(null)

  const headers = rows[0] ?? []
  const data = rows.slice(1)

  const mapped = useMemo(
    () =>
      data.map((r) => {
        const get = (f: ImportField) =>
          map[f] !== undefined ? (r[map[f]!] ?? '').trim() : ''
        return {
          name: get('name'),
          city: get('city'),
          phone: get('phone'),
          website: get('website'),
          instagram: get('instagram'),
          email: get('email'),
        }
      }),
    [data, map],
  )
  const validCount = mapped.filter((m) => m.name.length >= 2).length

  function load(text: string) {
    const parsed = parseCsv(text)
    if (parsed.length < 2) {
      toast.error(
        'Não encontrei linhas de dados. A primeira linha deve ser o cabeçalho.',
      )
      return
    }
    setRows(parsed)
    setMap(guessMapping(parsed[0]))
    setResult(null)
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    load(await file.text())
  }

  /** "Um por linha": cria um cabeçalho de uma coluna só com os nomes colados. */
  function loadPasted() {
    const lines = paste
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) {
      toast.error('Cole ao menos um nome.')
      return
    }
    setRows([['Nome'], ...lines.map((l) => [l])])
    setMap({ name: 0 })
    setResult(null)
  }

  function run() {
    start(async () => {
      try {
        const res = await importLeads(
          mapped.filter((m) => m.name.length >= 2),
          { niche, source, scheduleToday: schedule },
        )
        setResult(res)
        toast.success(`${res.imported} lead(s) importado(s).`)
        router.refresh()
      } catch {
        toast.error(
          'A importação falhou. Nada foi salvo pela metade? Confira a lista de leads.',
        )
      }
    })
  }

  if (result) {
    return (
      <div className="rounded-[3px] border border-pn-line bg-pn-card p-6 sm:p-8">
        <p className="font-pn-display text-[30px] font-medium leading-tight tracking-[-0.02em]">
          {result.imported}{' '}
          {result.imported === 1 ? 'lead entrou' : 'leads entraram'} no caderno.
        </p>
        <p className="mt-2 text-[14px] text-pn-muted">
          {result.skipped > 0 &&
            `${result.skipped} já existiam (mesmo telefone ou nome) e foram pulados. `}
          {result.invalid > 0 &&
            `${result.invalid} linhas sem nome válido foram ignoradas.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/admin" className={buttonCls('ink')}>
            Ver a fila de hoje
          </Link>
          <Link href="/admin/leads" className={buttonCls('outline')}>
            Ver todos os leads
          </Link>
          <Btn
            variant="ghost"
            onClick={() => {
              setRows([])
              setResult(null)
              setPaste('')
            }}
          >
            Importar outra lista
          </Btn>
        </div>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="space-y-5">
        <div
          className="flex gap-2"
          role="tablist"
          aria-label="Forma de importar"
        >
          <Btn
            variant={pasteMode ? 'outline' : 'ink'}
            size="sm"
            onClick={() => setPasteMode(false)}
            role="tab"
            aria-selected={!pasteMode}
          >
            Arquivo CSV
          </Btn>
          <Btn
            variant={pasteMode ? 'ink' : 'outline'}
            size="sm"
            onClick={() => setPasteMode(true)}
            role="tab"
            aria-selected={pasteMode}
          >
            Colar nomes
          </Btn>
        </div>

        {pasteMode ? (
          <div>
            <label
              htmlFor="paste"
              className="mb-1.5 block font-pn-mono text-[11px] uppercase tracking-[0.12em] text-pn-muted"
            >
              Um negócio por linha
            </label>
            <textarea
              id="paste"
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              rows={9}
              className={`${inputCls} py-3`}
              placeholder={
                'Clínica Sorriso Vivo\nEscritório Lima & Rocha\nImobiliária Horizonte'
              }
            />
            <Btn variant="ink" className="mt-3" onClick={loadPasted}>
              Continuar
            </Btn>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-[3px] border border-dashed border-pn-ink/40 bg-pn-card px-6 py-14 text-center transition-colors hover:bg-pn-sunk/60 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pn-ink">
            <FileUp size={28} strokeWidth={1.5} aria-hidden />
            <span className="font-pn-display text-[22px] italic">
              Escolha um arquivo .csv
            </span>
            <span className="max-w-md text-[13px] text-pn-muted">
              Serve a exportação de uma lista do Google Maps ou de uma planilha.
              A primeira linha precisa ser o cabeçalho; eu tento adivinhar as
              colunas.
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="map-h">
        <h2
          id="map-h"
          className="mb-3 font-pn-display text-[24px] font-medium tracking-[-0.02em]"
        >
          1. Confira as colunas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FIELDS.map((f) => (
            <Field
              key={f.id}
              label={`${f.label}${f.required ? ' *' : ''}`}
              htmlFor={`m-${f.id}`}
            >
              <select
                id={`m-${f.id}`}
                value={map[f.id] ?? ''}
                onChange={(e) =>
                  setMap((m) => ({
                    ...m,
                    [f.id]:
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                  }))
                }
                className={inputCls}
              >
                <option value="">(não importar)</option>
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h || `Coluna ${i + 1}`}
                  </option>
                ))}
              </select>
            </Field>
          ))}
        </div>
      </section>

      <section aria-labelledby="def-h">
        <h2
          id="def-h"
          className="mb-3 font-pn-display text-[24px] font-medium tracking-[-0.02em]"
        >
          2. Vale para todos
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nicho" htmlFor="imp-niche">
            <select
              id="imp-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value as NicheId)}
              className={inputCls}
            >
              {NICHES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Origem" htmlFor="imp-source">
            <select
              id="imp-source"
              value={source}
              onChange={(e) => setSource(e.target.value as SourceId)}
              className={inputCls}
            >
              {SOURCES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <label className="mt-3 flex min-h-[44px] cursor-pointer items-center gap-3 text-[14px]">
          <input
            type="checkbox"
            checked={schedule}
            onChange={(e) => setSchedule(e.target.checked)}
            className="h-5 w-5 accent-[rgb(var(--pn-ink))]"
          />
          Agendar o primeiro contato de todos para hoje
        </label>
      </section>

      <section aria-labelledby="prev-h">
        <h2
          id="prev-h"
          className="mb-3 font-pn-display text-[24px] font-medium tracking-[-0.02em]"
        >
          3. Prévia
        </h2>
        {map.name === undefined ? (
          <Empty title="Escolha a coluna do nome.">
            Sem ela eu não sei como chamar cada negócio.
          </Empty>
        ) : (
          <div className="overflow-x-auto rounded-[3px] border border-pn-line bg-pn-card pn-scroll">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-pn-line bg-pn-sunk/60 font-pn-mono text-[10.5px] uppercase tracking-[0.1em] text-pn-muted">
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Cidade</th>
                  <th className="px-3 py-2">Telefone</th>
                  <th className="px-3 py-2">Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pn-line">
                {mapped.slice(0, 8).map((m, i) => (
                  <tr key={i} className={m.name.length < 2 ? 'opacity-40' : ''}>
                    <td className="px-3 py-2 font-medium">
                      {m.name || '(sem nome)'}
                    </td>
                    <td className="px-3 py-2">{m.city}</td>
                    <td className="px-3 py-2 font-pn-mono text-[12px]">
                      {m.phone}
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2">
                      {m.website}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 font-pn-mono text-[12px] text-pn-muted">
          {validCount} de {data.length} linhas válidas. Telefones ou nomes que
          já existem são pulados.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Btn
          variant="ink"
          onClick={run}
          disabled={pending || validCount === 0 || map.name === undefined}
        >
          {pending ? 'Importando…' : `Importar ${validCount} lead(s)`}
        </Btn>
        <Btn variant="ghost" onClick={() => setRows([])} disabled={pending}>
          Escolher outro arquivo
        </Btn>
      </div>
    </div>
  )
}
