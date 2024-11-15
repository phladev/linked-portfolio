'use client'

import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

type FormData = {
  name: string
  email: string
  message: string
}

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    setIsLoading(true)
    const templateParams = {
      from_name: data.name,
      message: data.message,
      email: data.email,
    }

    emailjs
      .send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_API_KEY!,
      )
      .then(
        (response) => {
          if (response.status === 200) {
            toast.success('Email enviado com Sucesso!', {
              style: {
                background: '#000',
                color: '#fff',
              },
            })
          }
          reset()
        },
        (err) => {
          toast.error(`Algo de errado aconteceu! Erro: ${err}`)
        },
      )
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4">
      <div className="space-y-1">
        <Input
          type="text"
          placeholder="Seu Nome"
          {...register('name', { required: 'Nome é obrigatório' })}
          className="bg-white/10 border-purple-700 text-white placeholder-gray-400"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          type="email"
          placeholder="Seu email"
          {...register('email', {
            required: 'Email é obrigatório',
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: 'Digite um email válido',
            },
          })}
          className="bg-white/10 border-purple-700 text-white placeholder-gray-400"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Textarea
          placeholder="Sua mensagem"
          {...register('message', { required: 'Mensagem é obrigatória' })}
          className="bg-white/10 border-purple-700 text-white placeholder-gray-400 min-h-[150px]"
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-700 hover:bg-[#6b21a8] text-white disabled:bg-[#4d1c75]"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : 'Enviar Email'}
      </Button>
    </form>
  )
}

export default ContactForm
