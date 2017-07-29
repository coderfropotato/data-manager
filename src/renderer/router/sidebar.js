import AllFiles from '@/components/Sidebar/allFiles'
import Search from '@/components/Sidebar/search'
import RecentImport from '@/components/Sidebar/recentImport'
import Collection from '@/components/Sidebar/collection'

const routes = [
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

export default routes
