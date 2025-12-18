import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

// 捕获并处理可能的导航错误，避免控制台报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior: () => ({ y: 0 })
})

router.beforeEach((to, from, next) => {
  nprogress.start()
  
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 从store获取登录状态
    const isLoggedIn = store.getters['auth/isLoggedIn']
    
    if (!isLoggedIn) {
      // 未登录，重定向到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存当前路径，以便登录后跳转回来
      })
    } else {
      // 检查路由是否需要特定权限
      const requiresPermission = to.matched.some(record => record.meta.requiresPermission)
      
      if (requiresPermission) {
        // 获取路由需要的权限
        const permission = to.matched.find(record => record.meta.requiresPermission).meta.requiresPermission
        // 检查用户是否拥有该权限
        const hasPermission = store.getters['auth/hasPermission'](permission)
        
        if (!hasPermission) {
          // 没有权限，重定向到403页面
          next('/error-403')
        } else {
          next()
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  nprogress.done()
})

export default router
