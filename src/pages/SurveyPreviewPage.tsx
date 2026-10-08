import { Link, useParams } from 'react-router'
import { useAppSelector } from '../app/hooks'
import { QuestionField } from '../components/QuestionField'

export function SurveyPreviewPage() {
  const { id } = useParams()
  const survey = useAppSelector((state) =>
    state.surveys.items.find((s) => s.id === Number(id)),
  )

  if (!survey) return <main className="p-6">Опрос не найден</main>

  return (
    <main className="mx-auto max-w-2xl p-6">
      <p className="card mb-4 p-2 text-sm text-violet-200">
        Превью: так опрос увидит пользователь.{' '}
        <Link to={`/surveys/${survey.id}/edit`} className="underline">
          Вернуться в редактор
        </Link>
      </p>
      <h1 className="text-2xl font-bold">{survey.title}</h1>
      {survey.description && <p className="mt-1 text-neutral-400">{survey.description}</p>}
      <div className="mt-6 space-y-6">
        {survey.questions.map((q) => (
          <QuestionField key={q.id} question={q} value={null} onChange={() => {}} disabled />
        ))}
      </div>
    </main>
  )
}
