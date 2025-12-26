export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Todo {
  id: number
  title: string
  description: string
  status: TaskStatus
  created_at: string
  owner_id: number
}

export interface TodoCreate {
  title: string
  description: string
}

export interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
}

export interface UserCreate {
  email: string
  username: string
  password: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthToken {
  access_token: string
  token_type: string
}
