import axios from 'axios'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import router from '@/router'

const http = axios.create({
  baseURL: '/api',
  timeout: 60000
})

http.interceptors.request.use(
  config => {
    nprogress.start()
    // 添加token到请求头
    const token = store.getters['auth/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    nprogress.done()
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    nprogress.done()
    return response.data
  },
  error => {
    nprogress.done()
    
    // 统一错误处理
    let errorMessage = '请求失败，请稍后重试'
    
    if (error.response) {
      // 请求已发出，服务器返回状态码不是 2xx
      switch (error.response.status) {
        case 401:
          // 未授权，清除登录状态并重定向到登录页
          store.dispatch('auth/logout')
          router.push('/login')
          errorMessage = '登录已过期，请重新登录'
          break
        case 403:
          errorMessage = '您没有权限执行此操作'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 503:
          errorMessage = '服务器暂时不可用'
          break
        default:
          errorMessage = error.response.data?.msg || `请求失败 (${error.response.status})`
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = '网络错误，请检查网络连接'
    } else {
      // 请求配置有误
      errorMessage = error.message
    }
    
    // 如果是登录页面，不显示错误提示
    if (router.currentRoute.path !== '/login') {
      // 这里假设使用了Element UI的$message组件，需要在Vue实例中使用
      // 由于在拦截器中无法直接访问Vue实例，可以考虑使用事件总线或其他方式
      // 暂时先打印错误信息，实际项目中可以改进
      console.error('HTTP Error:', errorMessage)
    }
    
    return Promise.reject({ ...error, message: errorMessage })
  }
)

export default http
