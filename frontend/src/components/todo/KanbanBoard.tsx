import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import type { Todo, TaskStatus } from '../../types'
import { useTodoStore } from '../../store/todoStore'
import { useSettingsStore } from '../../store/settingsStore'
import { TodoColumn } from './TodoColumn'
import { TodoCard } from './TodoCard'
import { TodoModal } from './TodoModal'

export function KanbanBoard() {
  const { todos, fetchTodos, updateTodoStatus, isLoading } = useTodoStore()
  const { t } = useSettingsStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  useEffect(() => { fetchTodos() }, [fetchTodos])

  const todosByStatus: Record<TaskStatus, Todo[]> = {
    todo: todos.filter((t) => t.status === 'todo'),
    in_progress: todos.filter((t) => t.status === 'in_progress'),
    done: todos.filter((t) => t.status === 'done'),
  }

  const handleDragStart = (event: DragStartEvent) => {
    const todo = todos.find((t) => t.id === event.active.id)
    if (todo) setActiveTodo(todo)
  }

  const handleDragOver = (_event: DragOverEvent) => {}

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTodo(null)
    if (!over) return

    const todoId = active.id as number
    const newStatus = over.id as TaskStatus

    if (['todo', 'in_progress', 'done'].includes(newStatus)) {
      const todo = todos.find((t) => t.id === todoId)
      if (todo && todo.status !== newStatus) updateTodoStatus(todoId, newStatus)
    }
  }

  const handleAddClick = () => { setEditingTodo(null); setIsModalOpen(true) }
  const handleEditTodo = (todo: Todo) => { setEditingTodo(todo); setIsModalOpen(true) }
  const handleCloseModal = () => { setIsModalOpen(false); setEditingTodo(null) }

  if (isLoading && todos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#A9B388]/30 border-t-[#A9B388] rounded-full animate-spin" />
          <p className="text-dark-400">{t('loadingTasks')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 px-1">
          {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((status) => (
            <TodoColumn key={status} status={status} todos={todosByStatus[status]} onAddClick={handleAddClick} onEditTodo={handleEditTodo} />
          ))}
        </div>
        <DragOverlay>
          {activeTodo && <div className="rotate-3 opacity-90"><TodoCard todo={activeTodo} onEdit={() => {}} /></div>}
        </DragOverlay>
      </DndContext>
      <TodoModal isOpen={isModalOpen} onClose={handleCloseModal} editTodo={editingTodo} />
    </>
  )
}
