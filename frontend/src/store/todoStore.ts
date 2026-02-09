import { create } from 'zustand'
import { toast } from 'sonner'
import { api } from '../api/client'
import type { Todo, TodoCreate, TaskStatus } from '../types'

interface TodoState {
  todos: Todo[]
  isLoading: boolean
  
  fetchTodos: () => Promise<void>
  createTodo: (data: TodoCreate) => Promise<void>
  updateTodo: (id: number, data: Todo) => Promise<void>
  updateTodoStatus: (id: number, status: TaskStatus) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,

  fetchTodos: async () => {
    set({ isLoading: true })
    try {
      const todos = await api.getTodos()
      set({ todos, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch todos'
      toast.error(message)
      set({ isLoading: false })
    }
  },

  createTodo: async (data) => {
    try {
      const newTodo = await api.createTodo(data)
      set({ todos: [...get().todos, newTodo] })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create todo'
      toast.error(message)
      throw error
    }
  },

  updateTodo: async (id, data) => {
    try {
      const updatedTodo = await api.updateTodo(id, data)
      set({ todos: get().todos.map(t => t.id === id ? updatedTodo : t) })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update todo'
      toast.error(message)
      throw error
    }
  },

  updateTodoStatus: async (id, status) => {
    const previousTodos = get().todos
    set({ todos: previousTodos.map(t => t.id === id ? { ...t, status } : t) })
    
    try {
      await api.updateTodoStatus(id, status)
    } catch (error) {
      set({ todos: previousTodos })
      const message = error instanceof Error ? error.message : 'Failed to update status'
      toast.error(message)
    }
  },

  deleteTodo: async (id) => {
    const previousTodos = get().todos
    set({ todos: previousTodos.filter(t => t.id !== id) })
    
    try {
      await api.deleteTodo(id)
    } catch (error) {
      set({ todos: previousTodos })
      const message = error instanceof Error ? error.message : 'Failed to delete todo'
      toast.error(message)
    }
  },
}))
