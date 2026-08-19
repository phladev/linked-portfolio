'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'

type Status = 'idle' | 'sending' | 'sent'

const fieldClassName =
  'bg-surface border-white/[0.12] text-ink placeholder:text-muted2 focus-visible:ring-accent-purple'

const ContactForm = () => {
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName || !formEmail || !formMessage) return

    setStatus('sending')
    emailjs
      .send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        { from_name: formName, email: formEmail, message: formMessage },
        process.env.NEXT_PUBLIC_API_KEY!,
      )
      .then(
        () => setStatus('sent'),
        (err) => {
          toast.error(`Algo de errado aconteceu! Erro: ${err}`)
          setStatus('idle')
        },
      )
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-start gap-2 rounded-xl border border-white/[0.08] bg-canvas p-7">
        <span className="font-display text-lg font-medium text-ink">
          Mensagem enviada.
        </span>
        <span className="text-sm text-muted2">
          Obrigado pelo contato — retorno em breve.
        </span>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-canvas p-7"
    >
      <label className="flex flex-col gap-1.5 text-[13px] text-muted2">
        Nome
        <Input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          required
          className={fieldClassName}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] text-muted2">
        E-mail
        <Input
          type="email"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
          required
          className={fieldClassName}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] text-muted2">
        Mensagem
        <Textarea
          rows={4}
          value={formMessage}
          onChange={(e) => setFormMessage(e.target.value)}
          required
          className={fieldClassName}
        />
      </label>
      <Button
        type="submit"
        disabled={status === 'sending'}
        className="mt-1 bg-gradient-to-br from-accent-blue to-accent-purple text-canvas hover:brightness-110 disabled:opacity-60"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
      </Button>
    </form>
  )
}

export default ContactForm
