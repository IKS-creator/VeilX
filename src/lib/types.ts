export type ApiSuccess<T> = { success: true; data: T }
export type ApiError = { success: false; error: string }
export type ApiResponse<T> = ApiSuccess<T> | ApiError

export type UserStatus = 'active' | 'disabled'

export type User = {
  id: number
  name: string
  token: string
  vless_uuid: string
  status: UserStatus
  traffic_up: number
  traffic_down: number
  last_connected_at: string | null
  created_at: string
  updated_at: string
}

export type LoginAttempt = {
  ip: string
  attempts: number
  window_start: string
}
