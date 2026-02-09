import { create } from 'zustand'
import { api } from '../api/client'
import type { User, UserCreate, LoginCredentials } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: UserCreate) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (credentials) => {
    try {
      await api.login(credentials)
      const user = await api.getCurrentUser()
      set({ user, isAuthenticated: true })
    } catch (error) {
      throw error
    }
  },

  register: async (data) => {
    try {
      await api.register(data)
      await api.login({ username: data.username, password: data.password })
      const user = await api.getCurrentUser()
      set({ user, isAuthenticated: true })
    } catch (error) {
      throw error
    }
  },

  logout: () => {
    api.logout()
    set({ user: null, isAuthenticated: false })
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
}))
