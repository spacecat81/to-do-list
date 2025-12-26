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

  const style = { transform: CSS.Transform.toString(transform), transition }

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
      className={`group bg-dark-800 rounded-xl border border-dark-700/50 p-4 hover:border-dark-600 transition-all duration-200 ${isDragging ? 'opacity-50 shadow-2xl scale-105 rotate-2' : 'opacity-100'}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <button {...attributes} {...listeners} className="mt-0.5 p-1 -ml-1 text-dark-500 hover:text-dark-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4" />
        </button>
        
        <h4 className="flex-1 font-medium text-dark-100 line-clamp-2">{todo.title}</h4>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 text-dark-500 hover:text-dark-300 hover:bg-dark-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 z-20 w-36 bg-dark-700 rounded-xl border border-dark-600 shadow-xl overflow-hidden animate-scale-in">
                <button onClick={() => { onEdit(todo); setShowMenu(false) }} className="w-full px-4 py-2.5 text-left text-sm text-dark-200 hover:bg-dark-600 flex items-center gap-2">
                  <Pencil className="w-4 h-4" />{t('edit')}
                </button>
                <button onClick={handleDelete} className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />{t('delete')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {todo.description && <p className="text-sm text-dark-400 line-clamp-3 mb-3 ml-6">{todo.description}</p>}

      <div className="flex items-center gap-2 ml-6 text-xs text-dark-500">
        <Clock className="w-3.5 h-3.5" />
        <span>{formatDate(todo.created_at)}</span>
      </div>
    </div>
  )
}
