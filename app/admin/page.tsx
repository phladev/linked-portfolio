import { auth, signOut } from '@/lib/auth'

export default async function AdminHomePage() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-canvas px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-accent-purple">
          &lt;painel/&gt;
        </span>
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/admin/login' })
          }}
        >
          <button
            type="submit"
            className="text-sm text-muted2 transition-colors hover:text-ink"
          >
            Sair
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-medium text-ink">
          Painel administrativo
        </h1>
        <p className="text-sm text-muted2">
          Logado como {session?.user?.name ?? session?.user?.email}.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-surface p-6 text-sm text-muted2">
        Fase 0 concluída: autenticação e banco de dados estão no ar. As próximas
        fases adicionam aqui o CRUD de projetos, mensagens e conteúdo do site.
      </div>
    </div>
  )
}
