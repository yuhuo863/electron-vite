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
