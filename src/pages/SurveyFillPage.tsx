import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { QuestionField } from '../components/QuestionField'
import { addResponse } from '../features/responses/responsesSlice'
import type { AnswerValue } from '../types'

export function SurveyFillPage() {
  const { id } = useParams()
  const surveyId = Number(id)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const survey = useAppSelector((state) =>
    state.surveys.items.find((s) => s.id === surveyId),
  )
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [error, setError] = useState('')

  if (!survey || survey.status !== 'published') {
    return <main className="p-6">Опрос недоступен</main>
  }

  const setAnswer = (questionId: string) => (value: AnswerValue) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const missing = survey.questions.some((q) => {
      const v = answers[q.id]
      return q.required && (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length))
    })
    if (missing) {
      setError('Заполните обязательные вопросы')
      return
    }
    dispatch(
      addResponse({
        id: Date.now(),
        surveyId,
        answers,
        submittedAt: new Date().toISOString(),
      }),
    )
    navigate(`/s/${surveyId}/done`)
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">{survey.title}</h1>
      {survey.description && <p className="mt-1 text-neutral-400">{survey.description}</p>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {survey.questions.map((q) => (
          <QuestionField key={q.id} question={q} value={answers[q.id] ?? null} onChange={setAnswer(q.id)} />
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn">
          Отправить
        </button>
      </form>
    </main>
  )
}
