interface FailedQueue {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}

interface ILoginResponse {
  status: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
  errors?: string[]
}

type errorItem = {
  location: string
  msg: string
  path: string
  type: string
  value: string
}

interface IRegisterResponse {
  status: boolean
  message: string
  data?: {
    id: string
    username: string
    email: string
    createdAt: Date
  }
  errors?: errorItem[]
}

interface ILogoutResponse {
  status: boolean
  message: string
  data?: null
  errors?: string[]
}

interface ICaptchaResponse {
  status: boolean
  message: string
  data: {
    key: string
    captcha: string
  }
}
