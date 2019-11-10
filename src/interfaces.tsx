export interface User {
  email: string
  authToken: string
  renewToken: string
  isAuthenticated: boolean
}

export interface Credentials {
  email: string
  password: string
}

export interface AuthData {
  user?: User
}
