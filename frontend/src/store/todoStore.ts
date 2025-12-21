import { create } from 'zustand'
import { api } from '../api/client'
import type { Todo, TodoCreate, TaskStatus } from '../types'

interface TodoState {
  todos: Todo[]
  isLoading: boolean
  error: string | null
  
  fetchTodos: () => Promise<void>
  createTodo: (data: TodoCreate) => Promise<void>
  updateTodo: (id: number, data: Todo) => Promise<void>
  updateTodoStatus: (id: number, status: TaskStatus) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
  clearError: () => void
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true, error: null })
    try {
      const todos = await api.getTodos()
      set({ todos, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch todos',
        isLoading: false 
      })
    }
  },

  createTodo: async (data) => {
    set({ error: null })
    try {
      const newTodo = await api.createTodo(data)
      set({ todos: [...get().todos, newTodo] })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create todo' })
      throw error
    }
  },

  updateTodo: async (id, data) => {
    set({ error: null })
    try {
      const updatedTodo = await api.updateTodo(id, data)
      set({ todos: get().todos.map(t => t.id === id ? updatedTodo : t) })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update todo' })
      throw error
    }
  },

  updateTodoStatus: async (id, status) => {
    const previousTodos = get().todos
    set({ 
      todos: previousTodos.map(t => t.id === id ? { ...t, status } : t),
      error: null 
    })
    
    try {
      await api.updateTodoStatus(id, status)
    } catch (error) {
      set({ 
        todos: previousTodos,
        error: error instanceof Error ? error.message : 'Failed to update status'
      })
    }
  },

  deleteTodo: async (id) => {
    const previousTodos = get().todos
    set({ 
      todos: previousTodos.filter(t => t.id !== id),
      error: null 
    })
    
    try {
      await api.deleteTodo(id)
    } catch (error) {
      set({ 
        todos: previousTodos,
        error: error instanceof Error ? error.message : 'Failed to delete todo'
      })
    }
  },

  clearError: () => set({ error: null }),
}))
