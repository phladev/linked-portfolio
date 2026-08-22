import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  // fixo por ambiente (ver AUTH_URL no .env.local / Vercel) em vez de
  // confiar em detecção automática pelo header Host
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async signIn({ profile }) {
      const allowedId = process.env.ADMIN_GITHUB_ID
      if (!allowedId || !profile?.id) return false
      return String(profile.id) === allowedId
    },
  },
})
