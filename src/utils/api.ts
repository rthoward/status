import { create, ApiResponse } from "apisauce"
import config from "../config"

interface LoginResponse {
  data: {
    email: string
    token: string
    renew_token: string
  }
}

interface RegisterResponse {
  data: {
    token: string
    renew_token: string
  }
}

interface HealthResponse {
  data: {
    health: boolean
  }
}

interface ErrorResponse {
  error: {
    status: number
    message?: string
    errors: object
  }
}

class Api {
  api = create({
    baseURL: config.apiBase
  })

  setAuthHeader(authToken) {
    this.api.setHeader("Authorization", authToken)
  }

  async login({
    email,
    password
  }): Promise<ApiResponse<LoginResponse, ErrorResponse>> {
    return this.api.post("/session", { user: { email, password } })
  }

  async register({
    email,
    username,
    avatar,
    password,
    confirmPassword
  }): Promise<any> {
    return this.api.post("/registration", {
      user: {
        email,
        username,
        avatar,
        password,
        confirm_password: confirmPassword
      }
    })
  }

  async renew({ renewToken }): Promise<any> {
    this.setAuthHeader(renewToken)
    return this.api.post("/session/renew")
  }

  async health(): Promise<any> {
    return this.api.get("/health")
  }

  async statuses(): Promise<any> {
    return this.api.get("/status")
  }
}

export default new Api()
