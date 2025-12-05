import server from '@renderer/utils/request'

type LoginParams = {
  username: string
  password: string
}

type RegisterParams = {
  username: string
  email: string
  password: string
}

export default {
  /**登录 */
  loginApi: (data: LoginParams): Promise<ILoginResponse> => server.post('/auth/login', data),
  /**登出 */
  logoutApi: (): Promise<ILogoutResponse> => server.post('/auth/logout'),
  /**注册 */
  registerApi: (data: RegisterParams): Promise<IRegisterResponse> =>
    server.post('/auth/register', data),
  /**生成验证码 */
  generateCaptchaApi: (): Promise<ICaptchaResponse> => server.get('/captcha')
}
