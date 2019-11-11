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

  async statuses() {
    return {
      data: {
        data: {
          users: [
            {
              id: 1,
              email: "richard@example.com",
              name: "Richie",
              avatar: "RH",
              status: {
                place: { id: 1, name: "work", color: "blue" },
                timestamp: new Date(2019, 11, 10, 20, 30)
              }
            },
            {
              id: 2,
              email: "lane@example.com",
              avatar: "LC",
              name: "Lane",
              status: {
                place: { id: 1, name: "home", color: "blue" },
                timestamp: new Date(2019, 11, 10, 20, 30)
              }
            },
            {
              id: 3,
              email: "gordon@example.com",
              name: "Gordon",
              avatar: "GC",
              status: {
                place: { id: 1, name: "home", color: "blue" },
                timestamp: new Date(2019, 11, 10, 20, 30)
              }
            },
            {
              id: 4,
              email: "barry@example.com",
              name: "Barry",
              avatar: "BR",
              status: {
                place: { id: 1, name: "out", color: "blue" },
                timestamp: new Date(2019, 11, 10, 20, 30)
              }
            }
          ]
        }
      }
    }
  }
}

export default new Api()
