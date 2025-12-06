interface IUser {
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

interface UserForm {
  username: string
  email: string
  avatar: string
}

interface IUserUploadAvatar {
  status: boolean
  message: string
  data: {
    file: {
      fieldname: string
      originalname: string
      encoding: string
      mimetype: string
      size: number
      destination: string
      filename: string
      path: string
      url: string
    }
  }
}

interface IUserUpdateProfile {
  status: string
  message: string
  data: {
    updatedUser: {
      username: string
      email: string
      avatar: string | null
    }
  }
}

interface IEmailCode {
  status: string
  message: string
  data: null
}

interface IUserUpdatePassword {
  status: string
  message: string
  data: null
}

interface IUserItem {
  id: string
  username: string
  email: string
  avatar: string | null
  role: string
  isActive: boolean
  lastLogin: Date | null
  lockedUntil: Date | null
  passwordCount: number
  masterPasswordHint: string | null
  createdAt: Date
  updatedAt: Date
}
