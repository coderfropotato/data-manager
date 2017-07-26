import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import AllFiles from '@/components/Sidebar/allFiles'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: 'allfiles',
          name: 'AllFiles',
          component: AllFiles
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
