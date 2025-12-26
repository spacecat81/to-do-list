import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Circle, CheckCircle2 } from 'lucide-react'
import type { Todo, TaskStatus } from '../../types'
import { TodoCard } from './TodoCard'
import { WritingPencil } from '../icons/WritingPencil'
import { useSettingsStore } from '../../store/settingsStore'
import type { TranslationKey } from '../../i18n/translations'

interface TodoColumnProps {
  status: TaskStatus
  todos: Todo[]
  onAddClick: () => void
  onEditTodo: (todo: Todo) => void
}

const columnConfig: Record<TaskStatus, { titleKey: TranslationKey; bgColor: string; iconColor: string }> = {
  todo: { titleKey: 'todo', bgColor: 'bg-[#A9B388]/20', iconColor: 'text-[#A9B388]' },
  in_progress: { titleKey: 'inProgress', bgColor: 'bg-[#B99470]/20', iconColor: 'text-[#B99470]' },
  done: { titleKey: 'done', bgColor: 'bg-[#6b7d5c]/30', iconColor: 'text-[#FEFAE0]' },
}

function StatusIcon({ status, className }: { status: TaskStatus; className?: string }) {
  if (status === 'todo') return <Circle className={className} />
  if (status === 'in_progress') return <WritingPencil className={className} />
  return <CheckCircle2 className={className} />
}

export function TodoColumn({ status, todos, onAddClick, onEditTodo }: TodoColumnProps) {
  const config = columnConfig[status]
  const { t } = useSettingsStore()
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col min-w-[320px] max-w-[380px] w-full">
      <div className={`flex items-center justify-between h-16 px-4 rounded-t-2xl ${config.bgColor} border-b border-dark-700/50`}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <StatusIcon status={status} className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <h3 className="font-semibold text-dark-100">{t(config.titleKey)}</h3>
          <span className="px-2.5 py-1 text-xs font-medium bg-dark-700/50 text-dark-300 rounded-full min-w-[28px] text-center">{todos.length}</span>
        </div>
        
        <div className="w-8 h-8 flex items-center justify-center">
          {status === 'todo' && (
            <button onClick={onAddClick} className="p-1.5 text-dark-400 hover:text-dark-100 hover:bg-dark-700/50 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-3 space-y-3 rounded-b-2xl min-h-[200px] bg-dark-800/50 border border-t-0 border-dark-700/50 transition-colors duration-200 ${isOver ? 'bg-dark-700/50 border-[#A9B388]/50' : ''}`}
      >
        <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {todos.map((todo) => <TodoCard key={todo.id} todo={todo} onEdit={onEditTodo} />)}
        </SortableContext>

        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-dark-500">
            <StatusIcon status={status} className={`w-8 h-8 mb-2 opacity-50 ${config.iconColor}`} />
            <p className="text-sm">{t('empty')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
