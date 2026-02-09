import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, Clock, MoreHorizontal } from 'lucide-react'
import type { Todo } from '../../types'
import { useTodoStore } from '../../store/todoStore'
import { useSettingsStore } from '../../store/settingsStore'

interface TodoCardProps {
  todo: Todo
  onEdit: (todo: Todo) => void
}

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { deleteTodo } = useTodoStore()
  const { t, language } = useSettingsStore()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.03 : 1,
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const locale = language === 'ru' ? 'ru-RU' : language === 'pl' ? 'pl-PL' : 'en-US'
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
  }

  const handleDelete = () => {
    if (confirm(t('deleteConfirm'))) deleteTodo(todo.id)
    setShowMenu(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group card-outlined p-4 cursor-default transition-shadow duration-200 hover:shadow-md ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 -ml-1 rounded-sm cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--md-on-surface-variant)' }}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <h4
          className="flex-1 font-medium line-clamp-2 md-title-small"
          style={{ color: 'var(--md-on-surface)' }}
        >
          {todo.title}
        </h4>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="icon-btn w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div
                className="absolute right-0 top-8 z-20 w-40 rounded-md py-1 overflow-hidden"
                style={{
                  backgroundColor: 'var(--md-surface-container)',
                  boxShadow: '0 2px 6px 2px rgba(0,0,0,.15), 0 1px 2px 0 rgba(0,0,0,.3)',
                }}
              >
                <button
                  onClick={() => { onEdit(todo); setShowMenu(false) }}
                  className="w-full px-3 py-2.5 text-left md-body-medium flex items-center gap-3 transition-colors hover:bg-md-on-surface/[0.08]"
                  style={{ color: 'var(--md-on-surface)' }}
                >
                  <Pencil className="w-4 h-4" />
                  {t('edit')}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2.5 text-left md-body-medium flex items-center gap-3 transition-colors hover:bg-md-error/[0.08]"
                  style={{ color: 'var(--md-error)' }}
                >
                  <Trash2 className="w-4 h-4" />
                  {t('delete')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {todo.description && (
        <p
          className="md-body-small line-clamp-3 mb-3 ml-6"
          style={{ color: 'var(--md-on-surface-variant)' }}
        >
          {todo.description}
        </p>
      )}

      <div
        className="flex items-center gap-2 ml-6 md-label-small"
        style={{ color: 'var(--md-outline)' }}
      >
        <Clock className="w-3.5 h-3.5" />
        <span>{formatDate(todo.created_at)}</span>
      </div>
    </div>
  )
}
