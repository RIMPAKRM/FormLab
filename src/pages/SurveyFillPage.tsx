import { useParams } from 'react-router'

export function SurveyFillPage() {
  const { id } = useParams()

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Опрос #{id}</h1>
    </main>
  )
}
