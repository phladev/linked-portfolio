import { signIn } from '@/lib/auth'

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-canvas px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-mono text-sm text-accent-purple">
          &lt;painel/&gt;
        </span>
        <h1 className="font-display text-2xl font-medium text-ink">
          Acesso restrito
        </h1>
        <p className="max-w-xs text-sm text-muted2">
          Login exclusivo com a sua conta GitHub.
        </p>
      </div>

      <form
        action={async () => {
          'use server'
          await signIn('github', { redirectTo: '/admin' })
        }}
      >
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple px-6 py-3 text-sm font-medium text-canvas transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink"
        >
          Entrar com GitHub
        </button>
      </form>
    </div>
  )
}
