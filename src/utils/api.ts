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

  async login({
    email,
    password
  }): Promise<ApiResponse<LoginResponse, ErrorResponse>> {
    return this.api.post("/session", { user: { email, password } })
  }

  async register({ email, password, confirmPassword }): Promise<any> {
    return this.api.post("/registration", {
      user: { email, password, confirm_password: confirmPassword }
    })
  }

  async health(): Promise<any> {
    return this.api.get("/health")
  }

  async statuses(): Promise<any> {
    return this.api.get("/status")
  }
}

export default new Api()
