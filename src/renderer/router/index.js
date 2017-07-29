import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import AllFiles from '@/components/Sidebar/allFiles'
import Search from '@/components/Sidebar/search'
import RecentImport from '@/components/Sidebar/recentImport'
import Collection from '@/components/Sidebar/collection'
import addFile from './addFile'

Vue.use(Router)

const baseRoutes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      {
        path: 'allfiles',
        name: 'AllFiles',
        component: AllFiles
      },
      {
        path: 'search',
        name: 'Search',
        component: Search
      },
      {
        path: 'recentimport',
        name: 'RecentImport',
        component: RecentImport
      },
      {
        path: 'collection',
        name: 'Collection',
        component: Collection
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

let routes = baseRoutes.concat(addFile)

export default new Router({
  routes
})
