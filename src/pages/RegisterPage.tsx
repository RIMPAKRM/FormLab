import { Link } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { AuthForm } from '../features/auth/AuthForm'
import { register } from '../features/auth/authSlice'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.auth.users ?? [])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Регистрация</h1>
        <AuthForm
          submitLabel="Зарегистрироваться"
          submit={(c) => {
            if (users.some((u) => u.email === c.email)) return 'Email уже занят'
            dispatch(register(c))
            return null
          }}
        />
        <p className="text-sm text-neutral-400">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-violet-400 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </main>
  )
}
