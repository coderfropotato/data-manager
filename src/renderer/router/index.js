import Vue from 'vue'
import Router from 'vue-router'
// 加载根组件
import Index from '@/components/index'
// 加载路由模块
import sideBar from './sidebar'
import addFile from './newFile'
import content from './content'

Vue.use(Router)
// 合并嵌套自路由
let children = sideBar.concat(content)
const baseRoutes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children
  },
  {
    path: '*',
    redirect: '/'
  }
]
// 加入新窗口路由
let routes = baseRoutes.concat(addFile)

export default new Router({
  routes
})
