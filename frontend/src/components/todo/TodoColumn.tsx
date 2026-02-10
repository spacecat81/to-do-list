import type { CSSProperties } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
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

const columnConfig: Record<TaskStatus, {
  titleKey: TranslationKey
  accentVar: string
}> = {
  todo: { titleKey: 'todo', accentVar: '--md-primary' },
  in_progress: { titleKey: 'inProgress', accentVar: '--md-tertiary' },
  done: { titleKey: 'done', accentVar: '--md-secondary' },
}

function StatusIcon({ status, className, style }: { status: TaskStatus; className?: string; style?: CSSProperties }) {
  if (status === 'todo') return <Circle className={className} style={style} />
  if (status === 'in_progress') return <WritingPencil className={className} style={style} />
  return <CheckCircle2 className={className} style={style} />
}

export function TodoColumn({ status, todos, onAddClick, onEditTodo }: TodoColumnProps) {
  const config = columnConfig[status]
  const { t } = useSettingsStore()
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col min-w-[320px] max-w-[380px] w-full">
      {/* Column header */}
      <div
        className="flex items-center justify-between h-14 px-4 rounded-t-lg"
        style={{ backgroundColor: 'var(--md-surface-container)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <StatusIcon
              status={status}
              className="w-5 h-5"
              style={{ color: `var(${config.accentVar})` }}
            />
          </div>
          <h3
            className="md-title-small"
            style={{ color: 'var(--md-on-surface)' }}
          >
            {t(config.titleKey)}
          </h3>
          <motion.span
            key={todos.length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="px-2.5 py-0.5 rounded-full md-label-small min-w-[24px] text-center"
            style={{
              backgroundColor: 'var(--md-surface-container-highest)',
              color: 'var(--md-on-surface-variant)',
            }}
          >
            {todos.length}
          </motion.span>
        </div>

        <div className="w-8 h-8 flex items-center justify-center">
          {status === 'todo' && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onAddClick}
              className="icon-btn w-8 h-8"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Column body */}
      <motion.div
        ref={setNodeRef}
        animate={{
          backgroundColor: isOver
            ? 'var(--md-primary-container)'
            : 'var(--md-surface-container-low)',
        }}
        transition={{ duration: 0.2 }}
        className="flex-1 p-3 space-y-3 rounded-b-lg min-h-[200px] border border-t-0"
        style={{ borderColor: 'var(--md-outline-variant)' }}
      >
        <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {todos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} onEdit={onEditTodo} />
          ))}
        </SortableContext>

        {todos.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-8"
            style={{ color: 'var(--md-outline)' }}
          >
            <StatusIcon status={status} className="w-8 h-8 mb-2 opacity-40" />
            <p className="md-body-small">{t('empty')}</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
