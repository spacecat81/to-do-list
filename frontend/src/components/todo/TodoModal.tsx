import { useState, useEffect, FormEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { Todo, TodoCreate, TaskStatus } from '../../types'
import { useTodoStore } from '../../store/todoStore'
import { useSettingsStore } from '../../store/settingsStore'

interface TodoModalProps {
  isOpen: boolean
  onClose: () => void
  editTodo?: Todo | null
}

export function TodoModal({ isOpen, onClose, editTodo }: TodoModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { createTodo, updateTodo } = useTodoStore()
  const { t } = useSettingsStore()

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title)
      setDescription(editTodo.description)
      setStatus(editTodo.status)
    } else {
      setTitle('')
      setDescription('')
      setStatus('todo')
    }
  }, [editTodo, isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editTodo) {
        await updateTodo(editTodo.id, { ...editTodo, title, description, status })
      } else {
        const newTodo: TodoCreate = { title, description }
        await createTodo(newTodo)
      }
      onClose()
    } catch {} finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-lg card p-6 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-dark-400 hover:text-dark-200 hover:bg-dark-700 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-dark-100 mb-6">{editTodo ? t('editTask') : t('newTaskTitle')}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">{t('title')}</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder={t('whatToDo')} required autoFocus />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">{t('description')}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input min-h-[100px] resize-none" placeholder={t('addDetails')} required />
          </div>

          {editTodo && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-300">{t('status')}</label>
              <div className="flex gap-2">
                {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${status === s ? 'bg-[#B99470] text-[#FEFAE0]' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'}`}
                  >
                    {s === 'todo' && t('todo')}
                    {s === 'in_progress' && t('inProgress')}
                    {s === 'done' && t('done')}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">{t('cancel')}</button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editTodo ? t('save') : t('create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
