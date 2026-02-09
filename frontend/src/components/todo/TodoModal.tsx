import { useState, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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
        toast.success(t('save'))
      } else {
        const newTodo: TodoCreate = { title, description }
        await createTodo(newTodo)
        toast.success(t('create'))
      }
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--md-scrim)', opacity: 0.32 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="relative w-full max-w-lg rounded-xl p-6"
            style={{
              backgroundColor: 'var(--md-surface-container-high)',
              boxShadow: '0 8px 12px 6px rgba(0,0,0,.15), 0 4px 4px 0 rgba(0,0,0,.3)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 icon-btn w-8 h-8"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2
              className="md-headline-small font-medium mb-6"
              style={{ color: 'var(--md-on-surface)' }}
            >
              {editTodo ? t('editTask') : t('newTaskTitle')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title field */}
              <div className="space-y-1.5">
                <label
                  className="md-label-medium"
                  style={{ color: 'var(--md-on-surface-variant)' }}
                >
                  {t('title')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  placeholder={t('whatToDo')}
                  required
                  autoFocus
                />
              </div>

              {/* Description field */}
              <div className="space-y-1.5">
                <label
                  className="md-label-medium"
                  style={{ color: 'var(--md-on-surface-variant)' }}
                >
                  {t('description')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input min-h-[100px] resize-none"
                  placeholder={t('addDetails')}
                  required
                />
              </div>

              {/* Status selector (edit mode) */}
              {editTodo && (
                <div className="space-y-2">
                  <label
                    className="md-label-medium"
                    style={{ color: 'var(--md-on-surface-variant)' }}
                  >
                    {t('status')}
                  </label>
                  <div className="flex gap-2">
                    {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((s) => (
                      <motion.button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 px-4 py-2.5 rounded-full md-label-large transition-all"
                        style={{
                          backgroundColor: status === s
                            ? 'var(--md-primary)'
                            : 'var(--md-surface-container-highest)',
                          color: status === s
                            ? 'var(--md-on-primary)'
                            : 'var(--md-on-surface-variant)',
                        }}
                      >
                        {s === 'todo' && t('todo')}
                        {s === 'in_progress' && t('inProgress')}
                        {s === 'done' && t('done')}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outlined"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    editTodo ? t('save') : t('create')
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
