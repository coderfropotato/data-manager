/*
 * LoadContent 模块管理 sidebar 和 content 的命名路由视图
 * sidebar 为默认的路由视图，content 为命名路由视图
 */
// sidebar 的组件
import AllFiles from '@/components/Sidebar/allFiles'
import Search from '@/components/Sidebar/search'
import RecentImport from '@/components/Sidebar/recentImport'
import Collection from '@/components/Sidebar/collection'
// content 的组件
import FileHeader from '@/components/Content/diskDirHeader'
import sortDirMiddle from '@/components/Content/sortDirMiddle'
import List from '@/components/Content/list'

const routes = [
  {
    path: 'allfiles',
    name: 'AllFiles',
    components: {
      default: AllFiles,
      ContentHeader: FileHeader,
      ContentMiddle: sortDirMiddle,
      ContentList: List
    }
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

export default routes
