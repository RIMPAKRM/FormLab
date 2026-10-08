import { useParams } from 'react-router'

export function SurveyDonePage() {
  const { id } = useParams()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Спасибо, ответ записан</h1>
      <p className="text-sm text-neutral-400">Опрос #{id}</p>
    </main>
  )
}
