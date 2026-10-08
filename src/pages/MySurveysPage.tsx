import { Link, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { createSurvey, deleteSurvey } from '../features/surveys/surveysSlice'

const statusLabel = { draft: 'Черновик', published: 'Опубликован', closed: 'Закрыт' } as const

export function MySurveysPage() {
  const user = useAppSelector((state) => state.auth.user)!
  const surveys = useAppSelector((state) =>
    state.surveys.items.filter((s) => s.userId === user.id),
  )
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleCreate = () => {
    const now = new Date().toISOString()
    const survey = {
      id: Date.now(),
      userId: user.id,
      title: 'Новый опрос',
      status: 'draft' as const,
      questions: [],
      createdAt: now,
      updatedAt: now,
    }
    dispatch(createSurvey(survey))
    navigate(`/surveys/${survey.id}/edit`)
  }

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои опросы</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleCreate} className="btn cursor-pointer hover:bg-violet-700">
            Создать опрос
          </button>
          <button
            onClick={() => dispatch(logout())}
            className="text-sm text-neutral-400 hover:underline cursor-pointer"
          >
            Выйти
          </button>
        </div>
      </header>

      {surveys.length === 0 && <p className="text-neutral-400">Пока нет опросов</p>}

      <ul className="space-y-2">
        {surveys.map((s) => (
          <li key={s.id} className="card flex items-center justify-between p-3">
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-sm text-neutral-400">{statusLabel[s.status]}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link to={`/surveys/${s.id}/edit`} className="text-violet-400 hover:underline cursor-pointer">
                Редактор
              </Link>
              <Link to={`/surveys/${s.id}/preview`} className="text-violet-400 hover:underline cursor-pointer">
                Превью
              </Link>
              <Link to={`/surveys/${s.id}/results`} className="text-violet-400 hover:underline cursor-pointer">
                Результаты
              </Link>
              <Link to={`/s/${s.id}`} className="text-violet-400 hover:underline cursor-pointer">
                Ссылка
              </Link>
              <button
                onClick={() => dispatch(deleteSurvey(s.id))}
                className="text-red-600 hover:underline cursor-pointer hover:text-red-400"
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
