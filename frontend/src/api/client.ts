import type { Todo, TodoCreate, User, UserCreate, LoginCredentials, AuthToken, TaskStatus } from '../types'

const API_BASE = '/api'

class ApiClient {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('token')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }

  getToken() { return this.token }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`

    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }
    return response.json()
  }

  async register(data: UserCreate): Promise<User> {
    return this.request<User>('/auth/register', { method: 'POST', body: JSON.stringify(data) })
  }

  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    const token = await response.json()
    this.setToken(token.access_token)
    return token
  }

  async getCurrentUser(): Promise<User> { return this.request<User>('/auth/me') }
  logout() { this.setToken(null) }

  async getTodos(): Promise<Todo[]> { return this.request<Todo[]>('/todos/') }
  async getTodo(id: number): Promise<Todo> { return this.request<Todo>(`/todos/${id}`) }
  async createTodo(data: TodoCreate): Promise<Todo> { return this.request<Todo>('/todos/', { method: 'POST', body: JSON.stringify(data) }) }
  async updateTodo(id: number, data: Todo): Promise<Todo> { return this.request<Todo>(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
  async updateTodoStatus(id: number, status: TaskStatus): Promise<Todo> { return this.request<Todo>(`/todos/${id}/status?status=${status}`, { method: 'PATCH' }) }
  async deleteTodo(id: number): Promise<Todo> { return this.request<Todo>(`/todos/${id}`, { method: 'DELETE' }) }
}

export const api = new ApiClient()
