import { useParams } from 'react-router'

export function SurveyResultsPage() {
  const { id } = useParams()

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Результаты опроса #{id}</h1>
    </main>
  )
}
