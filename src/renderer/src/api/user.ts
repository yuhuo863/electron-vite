import servers from '@renderer/utils/request'

export default {
  /**获取个人信息 */
  getProfile: (): Promise<IUserProfile> => servers.get('/users/profile'),
  /**用户上传头像文件到阿里云OSS */
  uploadAvatar: (formData: FormData): Promise<IUserUploadAvatar> =>
    servers.post('/uploads', formData),
  /**更新用户信息 */
  updateProfile: (updateData: UserForm): Promise<IUserUpdateProfile> =>
    servers.put('/users/profile', updateData),
  /**发送邮箱验证码 */
  sendEmailCode: (email: string): Promise<IEmailCode> =>
    servers.post('/users/email-captcha', { email }),
  /**验证邮箱验证码 */
  verifyEmailCode: (email: string, code: string): Promise<IEmailCode> =>
    servers.post('/users/email-captcha/verify', { email, code }),
  /**更新账号密码 */
  updatePassword: (currentPassword: string, newPassword: string): Promise<IUserUpdatePassword> =>
    servers.put('/users/password', { currentPassword, newPassword })
}
