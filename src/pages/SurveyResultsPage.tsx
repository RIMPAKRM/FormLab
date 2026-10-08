import { Link, useParams } from 'react-router'
import { useAppSelector } from '../app/hooks'
import type { AnswerValue, Question } from '../types'

const optionLabel = (q: Question, value: string) =>
  q.options?.find((o) => o.id === value)?.label ?? value

const isAggregate = (q: Question) =>
  q.type === 'single_choice' ||
  q.type === 'multiple_choice' ||
  q.type === 'dropdown' ||
  q.type === 'scale' ||
  q.type === 'rating'

export function SurveyResultsPage() {
  const { id } = useParams()
  const surveyId = Number(id)
  const survey = useAppSelector((state) =>
    state.surveys.items.find((s) => s.id === surveyId),
  )
  const responses = useAppSelector((state) =>
    state.responses.items.filter((r) => r.surveyId === surveyId),
  )

  if (!survey) return <main className="p-6">Опрос не найден</main>

  const answers = (q: Question): AnswerValue[] =>
    responses.map((r) => r.answers[q.id]).filter((v) => v !== null && v !== undefined && v !== '')

  const counts = (q: Question) => {
    const map = new Map<string, number>()
    for (const v of answers(q)) {
      for (const item of Array.isArray(v) ? v : [v]) {
        const key = optionLabel(q, String(item))
        map.set(key, (map.get(key) ?? 0) + 1)
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold">Результаты: {survey.title}</h1>
        <p className="text-sm text-neutral-400">
          Ответов: {responses.length} ·{' '}
          <Link to="/" className="text-violet-400 hover:underline">
            К списку
          </Link>
        </p>
      </header>

      {survey.questions.map((q) => (
        <section key={q.id} className="card space-y-2 p-4">
          <h2 className="font-medium">{q.title}</h2>
          {isAggregate(q) ? (
            <ul className="space-y-1 text-sm">
              {counts(q).map(([label, count]) => (
                <li key={label} className="flex justify-between">
                  <span>{label}</span>
                  <span>{count}</span>
                </li>
              ))}
              {counts(q).length === 0 && <li className="text-neutral-500">Нет ответов</li>}
            </ul>
          ) : (
            <ul className="space-y-1 text-sm">
              {answers(q).map((v, i) => (
                <li key={i} className="rounded bg-neutral-800 px-2 py-1">
                  {String(v)}
                </li>
              ))}
              {answers(q).length === 0 && <li className="text-neutral-500">Нет ответов</li>}
            </ul>
          )}
        </section>
      ))}
    </main>
  )
}
