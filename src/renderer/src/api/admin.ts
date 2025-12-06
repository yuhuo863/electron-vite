import server from '@renderer/utils/request'

export default {
  /**获取用户列表 */
  getUserList: () => server.get('/admin/users'),
  /**更新用户状态 */
  updateUserStatus: (id: string, isActive: boolean): Promise<{ message: string }> =>
    server.put(`/admin/users/${id}/status`, { isActive }),
  /**更新用户角色 */
  updateUserRole: (id: string, role: string, reason?: string): Promise<{ message: string }> =>
    server.put(`/admin/users/${id}/role`, { role, reason }),
  /**获取系统统计信息 */
  getSystemStats: () => server.get('/admin/stats')
}
