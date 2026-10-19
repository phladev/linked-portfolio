import Link from 'next/link'
import { cn } from '@/lib/utils'

export const inputCls =
  'min-h-[44px] w-full rounded-[3px] border border-pn-line bg-pn-card px-3 text-[15px] text-pn-ink placeholder:text-pn-muted/70 transition-colors focus:border-pn-ink focus:outline-none disabled:opacity-60'

export const labelCls =
  'mb-1.5 block font-pn-mono text-[11px] uppercase tracking-[0.12em] text-pn-muted'

const variants = {
  ink: 'bg-pn-ink text-pn-paper hover:bg-pn-ink/85',
  signal: 'bg-pn-signal text-white hover:brightness-110',
  outline: 'border border-pn-ink/30 text-pn-ink hover:bg-pn-sunk',
  ghost: 'text-pn-ink hover:bg-pn-sunk',
  danger: 'border border-pn-signal/40 text-pn-signal hover:bg-pn-signal/10',
} as const

const sizes = {
  md: 'min-h-[44px] px-4 text-[14px]',
  sm: 'min-h-[36px] px-3 text-[13px]',
} as const

export function buttonCls(
  variant: keyof typeof variants = 'ink',
  size: keyof typeof sizes = 'md',
  className?: string,
) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-[3px] font-semibold tracking-[0.01em] transition active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function Btn({
  variant,
  size,
  className,
  type = 'button',
  ...rest
}: BtnProps) {
  return (
    <button
      type={type}
      className={buttonCls(variant, size, className)}
      {...rest}
    />
  )
}

export function LinkBtn({
  href,
  variant,
  size,
  className,
  external,
  children,
  ...rest
}: {
  href: string
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  className?: string
  external?: boolean
  children: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const cls = buttonCls(variant, size, className)
  if (external)
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...rest}
      >
        {children}
      </a>
    )
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  )
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[12px] text-pn-muted">{hint}</p>}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  actions,
  children,
}: {
  eyebrow?: string
  title: string
  actions?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <header className="mb-7 sm:mb-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-2 font-pn-mono text-[11px] uppercase tracking-[0.16em] text-pn-muted">
              {eyebrow}
            </p>
          )}
          <h1 className="font-pn-display text-[34px] font-medium leading-[1.05] tracking-[-0.02em] text-pn-ink sm:text-[44px]">
            {title}
          </h1>
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
      {children}
      <div className="pn-rule mt-5" aria-hidden />
    </header>
  )
}

export function Empty({
  title,
  children,
  action,
}: {
  title: string
  children?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-[3px] border border-dashed border-pn-line px-6 py-12 text-center">
      <p className="font-pn-display text-[22px] italic text-pn-ink">{title}</p>
      {children && (
        <p className="mx-auto mt-2 max-w-md text-[14px] text-pn-muted">
          {children}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
