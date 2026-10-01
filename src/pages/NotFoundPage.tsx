import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">404 — страница не найдена</h1>
      <Link to="/" className="text-blue-600 hover:underline">
        На главную
      </Link>
    </main>
  )
}
