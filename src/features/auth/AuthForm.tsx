import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import type { Credentials } from '../../types'

const schema = z.object({
  email: z.email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

interface AuthFormProps {
  submitLabel: string
  submit: (credentials: Credentials) => string | null
}

export function AuthForm({ submitLabel, submit }: AuthFormProps) {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Credentials>({ resolver: zodResolver(schema) })

  const onSubmit = (credentials: Credentials) => {
    const error = submit(credentials)
    if (error) {
      setError('root', { message: error })
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <input
          type="password"
          placeholder="Пароль"
          className="w-full rounded border px-3 py-2"
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>
      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
      <button type="submit" className="btn w-full">
        {submitLabel}
      </button>
    </form>
  )
}
