/// <reference types="@electron-toolkit/preload" />
interface IUserProfile {
  status: boolean
  message: string
  data: {
    user: {
      id: string
      username: string
      email: string
      avatar: string | null
      role: string
      isActive: boolean
      lastLogin: Date | null
      createdAt: Date
      updatedAt: Date
    }
  }
}

interface IToken {
  accessToken: string
  refreshToken: string
}

interface windowProps {
  width: number
  height: number
  resizable: boolean
}

interface LocalIp {
  name: string
  address: string
}

interface SystemInfo {
  type: string
  platform: string
  release: string
  uptime: number
  hostname: string
  arch: string
  cpus: {
    model: string
    cores: number
  }
  totalMemBytes: number
  freeMemBytes: number
  localIps: LocalIp[]
}

interface Window {
  authAPI: {
    saveTokens: (token: IToken) => Promise<void>
    getTokens: () => Promise<IToken | null>
    removeTokens: () => Promise<void>
    windowResize: (data: windowProps) => void
    minimizeWindow: () => void
    closeWindow: () => void
    getSystemInfo: () => Promise<SystemInfo>
  }
}
