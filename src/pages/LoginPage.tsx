import { Link } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { AuthForm } from '../features/auth/AuthForm'
import { setCredentials } from '../features/auth/authSlice'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.auth.users ?? [])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Вход</h1>
        <AuthForm
          submitLabel="Войти"
          submit={(c) => {
            const user = users.find((u) => u.email === c.email && u.password === c.password)
            if (!user) return 'Неверный email или пароль'
            dispatch(setCredentials({ id: user.id, email: user.email }))
            return null
          }}
        />
        <p className="text-sm text-neutral-400">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-violet-400 hover:underline cursor-pointer">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </main>
  )
}
