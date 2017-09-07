import Vue from 'vue'
import Router from 'vue-router'
// 新建文件夹的路由不属于 index 的自路由，需要单独引入
import newDirRoute from './newDirectory'

Vue.use(Router)

// 加载根组件
const Index = r => require.ensure([], () => r(require('@/views/index')), 'index')
// 其他路由模块
const routeModules = require.context('.', false, /\.js$/)
let childrenRoutes = []

routeModules.keys().forEach(key => {
  if (key === './index.js' || key === './newDirectory.js') {
    return
  }
  childrenRoutes = childrenRoutes.concat(routeModules(key).default)
})

const baseRoutes = [
  {
    path: '/',
    name: 'Index',
    components: {
      default: Index
    },
    children: childrenRoutes
  },
  {
    path: '*',
    redirect: '/'
  }
]

// 附加路由
let routes = baseRoutes.concat(newDirRoute)

export default new Router({
  routes
})
