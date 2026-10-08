import type { AnswerValue, Question } from '../types'

interface QuestionFieldProps {
  question: Question
  value: AnswerValue
  onChange: (value: AnswerValue) => void
  disabled?: boolean
}

export function QuestionField({ question, value, onChange, disabled }: QuestionFieldProps) {
  const input = (() => {
    switch (question.type) {
      case 'short_text':
        return (
          <input
            className="w-full rounded border px-3 py-2"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
        )
      case 'long_text':
        return (
          <textarea
            className="w-full rounded border px-3 py-2"
            rows={4}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
        )
      case 'single_choice':
      case 'scale':
      case 'rating': {
        const options =
          question.type === 'single_choice'
            ? (question.options ?? [])
            : Array.from(
                {
                  length:
                    question.type === 'scale'
                      ? (question.scale?.max ?? 10) - (question.scale?.min ?? 1) + 1
                      : 5,
                },
                (_, i) => ({
                  id: String(
                    question.type === 'scale' ? (question.scale?.min ?? 1) + i : i + 1,
                  ),
                  label: String(
                    question.type === 'scale' ? (question.scale?.min ?? 1) + i : i + 1,
                  ),
                }),
              )
        return (
          <div className="flex flex-wrap gap-3">
            {options.map((o) => (
              <label key={o.id} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={question.id}
                  checked={value === o.id}
                  onChange={() => onChange(o.id)}
                  disabled={disabled}
                />
                {o.label}
              </label>
            ))}
          </div>
        )
      }
      case 'multiple_choice': {
        const selected = Array.isArray(value) ? value : []
        return (
          <div className="space-y-1">
            {(question.options ?? []).map((o) => (
              <label key={o.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(o.id)}
                  onChange={(e) =>
                    onChange(
                      e.target.checked
                        ? [...selected, o.id]
                        : selected.filter((id) => id !== o.id),
                    )
                  }
                  disabled={disabled}
                />
                {o.label}
              </label>
            ))}
          </div>
        )
      }
      case 'dropdown':
        return (
          <select
            className="w-full rounded border px-3 py-2"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value || null)}
            disabled={disabled}
          >
            <option value="">— выбрать —</option>
            {(question.options ?? []).map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        )
      case 'date':
        return (
          <input
            type="date"
            className="rounded border px-3 py-2"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
        )
    }
  })()

  return (
    <fieldset className="space-y-2">
      <legend className="font-medium">
        {question.title}
        {question.required && <span className="text-red-600"> *</span>}
      </legend>
      {question.description && <p className="text-sm text-neutral-400">{question.description}</p>}
      {input}
      {question.type === 'scale' && (question.scale?.minLabel || question.scale?.maxLabel) && (
        <div className="flex justify-between text-xs text-neutral-400">
          <span>{question.scale?.minLabel}</span>
          <span>{question.scale?.maxLabel}</span>
        </div>
      )}
    </fieldset>
  )
}
