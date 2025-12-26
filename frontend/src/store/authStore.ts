import { create } from 'zustand'
import { api } from '../api/client'
import type { User, UserCreate, LoginCredentials } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: UserCreate) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      await api.login(credentials)
      const user = await api.getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      })
      throw error
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await api.register(data)
      await api.login({ username: data.username, password: data.password })
      const user = await api.getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      })
      throw error
    }
  },

  logout: () => {
    api.logout()
    set({ user: null, isAuthenticated: false, error: null })
  },

  checkAuth: async () => {
    const token = api.getToken()
    if (!token) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }

    try {
      const user = await api.getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      api.logout()
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
