import servers from '@renderer/utils/request'
import { AxiosRequestConfig } from 'axios'

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
  verifyEmailCode: (newPassword: string, email: string, code: string): Promise<IEmailCode> =>
    servers.post('/users/email-captcha/verify', { newPassword, email, code }),
  /**更新账号密码 */
  updatePassword: (currentPassword: string, newPassword: string): Promise<IUserUpdatePassword> =>
    servers.put('/users/password', { currentPassword, newPassword }),
  /**检查是否可以再次评分 */
  checkCanRate: () => servers.get('/feedback/status'),
  /**提交评分 */
  submitRating: (
    score: number,
    content?: string
  ): Promise<{ status: boolean; message: string; data?: null }> =>
    servers.post('/feedback', { score, content }),
  /**获取当前用户的密码操作日志 */
  getPasswordLogs: () => servers.get('/users/password-logs'),
  /**数据导出 */
  exportData: (params = {}) => servers.get('/tools/export', { params }),
  /**数据导入 */
  importData: (
    data,
    config: AxiosRequestConfig
  ): Promise<{ status: boolean; message: string; data?: null }> =>
    servers.post('/tools/import', data, config)
}
