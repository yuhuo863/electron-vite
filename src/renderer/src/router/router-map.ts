import { RouteRecordRaw } from 'vue-router'
import LoginPage from '@renderer/views/LoginPage.vue'
import LandingPage from '@renderer/layouts/LandingPage.vue'
import DataBoard from '@renderer/layouts/DataBoard.vue'
import GeneralView from '@renderer/views/GeneralView.vue'
import AuthPage from '@renderer/views/AuthPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthPage,
    meta: {
      title: 'Auth',
      requiresAuth: false,
      isLoginPage: true
    },
    children: [
      {
        path: '',
        name: 'login',
        component: LoginPage,
        meta: {
          title: '登录',
          requiresAuth: false,
          isLoginPage: true
        }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@renderer/views/RegisterPage.vue'),
        meta: {
          title: '注册',
          requiresAuth: false,
          isLoginPage: true
        }
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@renderer/views/ForgotPasswordPage.vue'),
        meta: {
          title: '忘记密码',
          requiresAuth: false,
          isLoginPage: true
        }
      }
    ]
  },
  {
    path: '/',
    name: 'home',
    component: LandingPage,
    meta: {
      title: '首页',
      requiresAuth: true,
      isLoginPage: false
    },
    children: [
      {
        path: '',
        name: 'databoard',
        component: DataBoard,
        meta: { title: '数据面板' }
      },
      {
        path: 'password',
        name: 'password',
        component: () => import('@renderer/views/PasswordPage.vue'),
        meta: { title: '所有密码' },
        children: [
          {
            path: '',
            name: 'password-list',
            component: () => import('@renderer/views/PasswordView.vue'),
            meta: { title: '密码列表' }
          },

          {
            path: ':id',
            name: 'password-detail',
            component: () => import('@renderer/views/PasswordDetailPage.vue'),
            meta: { title: '密码详情' }
          }
        ]
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@renderer/views/CategoryPage.vue'),
        meta: { title: '我的分类' }
      },
      {
        path: 'trash',
        name: 'trash',
        component: () => import('@renderer/views/TrashPage.vue'),
        meta: { title: '回收站' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@renderer/views/SettingsPage.vue'),
        meta: { title: '应用设置' },
        children: [
          {
            path: '',
            name: 'settings-general',
            component: GeneralView,
            meta: { title: '基础设置' }
          },
          {
            path: 'masterPasswd',
            name: 'masterPasswd',
            component: () => import('@renderer/views/components/MasterPasswdView.vue'),
            meta: { title: '主密码设置' }
          }
        ]
      },
      {
        path: 'changelog',
        name: 'changelog',
        component: () => import('@renderer/views/ChangelogPage.vue'),
        meta: { title: '系统更新' }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@renderer/views/AdminPage.vue'),
        meta: { title: '管理面板' },
        children: [
          {
            path: '',
            name: 'admin-overview',
            component: () => import('@renderer/views/AdminView.vue'),
            meta: { title: '概览' }
          },
          {
            path: 'users',
            name: 'admin-users',
            component: () => import('@renderer/views/UsersPage.vue'),
            meta: { title: '用户管理' }
          },
          {
            path: 'monitor',
            name: 'admin-monitor',
            component: () => import('@renderer/views/MonitorPage.vue'),
            meta: { title: '系统监控' }
          },
          {
            path: 'actionlogs',
            name: 'action-logs',
            component: () => import('@renderer/views/ActionLogsPage.vue'),
            meta: { title: '操作日志' }
          },
          {
            path: 'systemlogs',
            name: 'system-logs',
            component: () => import('@renderer/views/SystemLogsPage.vue'),
            meta: { title: '系统日志' }
          }
        ]
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@renderer/views/404.vue') }
]

export default routes
