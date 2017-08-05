import Vue from 'vue'
import Router from 'vue-router'
// 加载根组件
import Index from '@/components/index'
// 加载路由模块
/*
 * LoadContent 模块管理 sidebar 和 content 的命名路由视图
 * sidebar 为默认的路由视图，content 为命名路由视图
 */

import LoadContent from './loadContent'
import NewFile from './newDirectory'

Vue.use(Router)

const baseRoutes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: LoadContent
  },
  {
    path: '*',
    redirect: '/'
  }
]
// 加入新窗口路由
let routes = baseRoutes.concat(NewFile)

export default new Router({
  routes
})
