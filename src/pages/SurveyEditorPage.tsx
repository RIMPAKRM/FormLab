import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { updateSurvey } from '../features/surveys/surveysSlice'
import type { Question, QuestionType, Survey, SurveyStatus } from '../types'

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'short_text', label: 'Строка' },
  { value: 'long_text', label: 'Абзац' },
  { value: 'single_choice', label: 'Один вариант' },
  { value: 'multiple_choice', label: 'Несколько вариантов' },
  { value: 'dropdown', label: 'Выпадающий список' },
  { value: 'scale', label: 'Шкала' },
  { value: 'rating', label: 'Рейтинг' },
  { value: 'date', label: 'Дата' },
]

const hasOptions = (t: QuestionType) =>
  t === 'single_choice' || t === 'multiple_choice' || t === 'dropdown'

const newQuestion = (type: QuestionType): Question => ({
  id: crypto.randomUUID(),
  type,
  title: '',
  required: false,
  ...(hasOptions(type) ? { options: [{ id: crypto.randomUUID(), label: 'Вариант 1' }] } : {}),
  ...(type === 'scale' ? { scale: { min: 1, max: 10 } } : {}),
})

export function SurveyEditorPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) =>
    state.surveys.items.find((s) => s.id === Number(id)),
  )
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState<Survey | undefined>(undefined)
  if (data && data !== loaded) {
    setLoaded(data)
    setSurvey(data)
  }

  if (!survey) return <main className="p-6">Опрос не найден</main>

  const patch = (p: Partial<Survey>) => {
    setSaved(false)
    setSurvey({ ...survey, ...p })
  }
  const patchQuestion = (qid: string, p: Partial<Question>) =>
    patch({ questions: survey.questions.map((q) => (q.id === qid ? { ...q, ...p } : q)) })
  const move = (index: number, dir: -1 | 1) => {
    const questions = [...survey.questions]
    const [q] = questions.splice(index, 1)
    questions.splice(index + dir, 0, q)
    patch({ questions })
  }

  const save = () => {
    dispatch(updateSurvey({ ...survey, updatedAt: new Date().toISOString() }))
    setSaved(true)
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Редактор</h1>
        <div className="flex gap-3 text-sm">
          <Link to="/" className="text-violet-400 hover:underline">
            К списку
          </Link>
          <Link to={`/surveys/${survey.id}/preview`} className="text-violet-400 hover:underline">
            Превью
          </Link>
        </div>
      </header>

      <input
        className="w-full rounded border px-3 py-2 text-xl font-medium"
        placeholder="Название опроса"
        value={survey.title}
        onChange={(e) => patch({ title: e.target.value })}
      />
      <textarea
        className="w-full rounded border px-3 py-2"
        placeholder="Описание"
        value={survey.description ?? ''}
        onChange={(e) => patch({ description: e.target.value })}
      />

      <div className="space-y-4">
        {survey.questions.map((q, i) => (
          <div key={q.id} className="card space-y-2 p-4">
            <div className="flex items-center gap-3">
              <input
                className="flex-1 rounded border px-3 py-2"
                placeholder="Вопрос"
                value={q.title}
                onChange={(e) => patchQuestion(q.id, { title: e.target.value })}
              />
              <select
                className="rounded border px-2 py-2 cursor-pointer"
                value={q.type}
                onChange={(e) => patchQuestion(q.id, newQuestion(e.target.value as QuestionType))}
              >
                {questionTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Подсказка (необязательно)"
              value={q.description ?? ''}
              onChange={(e) => patchQuestion(q.id, { description: e.target.value })}
            />
            {hasOptions(q.type) && (
              <div className="space-y-1">
                {(q.options ?? []).map((o) => (
                  <div key={o.id} className="flex gap-2">
                    <input
                      className="flex-1 rounded border px-3 py-1 text-sm"
                      value={o.label}
                      onChange={(e) =>
                        patchQuestion(q.id, {
                          options: q.options!.map((x) =>
                            x.id === o.id ? { ...x, label: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <button
                      onClick={() =>
                        patchQuestion(q.id, {
                          options: q.options!.filter((x) => x.id !== o.id),
                        })
                      }
                      className="text-sm text-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    patchQuestion(q.id, {
                      options: [
                        ...(q.options ?? []),
                        { id: crypto.randomUUID(), label: `Вариант ${(q.options?.length ?? 0) + 1}` },
                      ],
                    })
                  }
                  className="text-sm text-violet-400 hover:underline cursor-pointer"
                >
                  + вариант
                </button>
              </div>
            )}
            {q.type === 'scale' && (
              <div className="flex gap-2 text-sm">
                <input
                  type="number"
                  className="w-20 rounded border px-2 py-1 c"
                  value={q.scale?.min ?? 1}
                  onChange={(e) =>
                    patchQuestion(q.id, {
                      scale: { ...q.scale!, min: Number(e.target.value) },
                    })
                  }
                />
                <input
                  type="number"
                  className="w-20 rounded border px-2 py-1"
                  value={q.scale?.max ?? 10}
                  onChange={(e) =>
                    patchQuestion(q.id, {
                      scale: { ...q.scale!, max: Number(e.target.value) },
                    })
                  }
                />
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) => patchQuestion(q.id, { required: e.target.checked })}
                  className="cursor-pointer accent-violet-500"
                />
                Обязательный
              </label>
              <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30">
                ↑
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === survey.questions.length - 1}
                className="disabled:opacity-30"
              >
                ↓
              </button>
              <button
                onClick={() =>
                  patch({ questions: survey.questions.filter((x) => x.id !== q.id) })
                }
                className="text-red-600 hover:text-red-700 cursor-pointer"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => patch({ questions: [...survey.questions, newQuestion('short_text')] })}
        className="card px-4 py-2 cursor-pointer hover:bg-violet-700 hover:text-white">
        + Добавить вопрос
      </button>

      <footer className="flex items-center gap-4 border-t border-violet-500/30 pt-4">
        <select
          className="rounded border px-2 py-2 cursor-pointer"
          value={survey.status}
          onChange={(e) => patch({ status: e.target.value as SurveyStatus })}
        >
          <option value="draft">Черновик</option>
          <option value="published">Опубликован</option>
          <option value="closed">Закрыт</option>
        </select>
        <button onClick={save} className="btn cursor-pointer">
          Сохранить
        </button>
        {saved && <span className="self-center text-sm text-green-600">Сохранено</span>}
      </footer>
    </main>
  )
}
