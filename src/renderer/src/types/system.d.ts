interface User {
  name: string
  value: number
  color: string
}
interface Password {
  name: string
  value: number
}
interface ActiveUser {
  date: never
  count: number
}
interface SystemStatus {
  users: User[]
  passwords: number[]
  dailyActiveUsers: ActiveUser[]
  activeRate: number
}
