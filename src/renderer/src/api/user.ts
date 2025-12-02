import servers from '@renderer/utils/request'

export default {
  /**获取个人信息 */
  getProfile: (): Promise<IUserProfile> => servers.get('/users/profile'),
  /**用户上传头像文件到阿里云OSS */
  uploadAvatar: (formData: FormData): Promise<IUserUploadAvatar> =>
    servers.post('/uploads', formData),
  /**更新用户信息 */
  updateProfile: (updateData: UserForm): Promise<IUserUpdateProfile> =>
    servers.put('/users/profile', updateData)
}
