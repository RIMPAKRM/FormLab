export type QuestionType =
  | 'short_text'      // строка
  | 'long_text'       // абзац
  | 'single_choice'   // один вариант (radio)
  | 'multiple_choice' // несколько вариантов (checkbox)
  | 'dropdown'        // выпадающий список
  | 'scale'           // шкала, например 1–10
  | 'rating'          // звёзды 1–5
  | 'date'

export interface Option {
  id: string
  label: string
}

export interface Question {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  options?: Option[]           // для single/multiple/dropdown
  scale?: { min: number; max: number; minLabel?: string; maxLabel?: string }
}

export type SurveyStatus = 'draft' | 'published' | 'closed'

export interface Survey {
  id: number
  userId: number               // автор (нужно для json-server-auth)
  title: string
  description?: string
  status: SurveyStatus
  questions: Question[]
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: number
  email: string
}

export interface Credentials {
  email: string
  password: string
}

export type AnswerValue = string | string[] | number | null

export interface SurveyResponse {
  id: number
  surveyId: number
  answers: Record<string, AnswerValue> // ключ — question.id
  submittedAt: string
}
