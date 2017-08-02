/*
 * LoadContent 模块管理 sidebar 和 content 的命名路由视图
 * sidebar 为默认的路由视图，content 为命名路由视图
 */
// sidebar 的组件
import Files from '@/components/Sidebar/Files'
import Search from '@/components/Sidebar/search'
// import FileStatus from '@/components/Sidebar/fileStatus'
import Collection from '@/components/Sidebar/collection'
// content 的组件
import FileHeader from '@/components/Content/diskDirHeader'
import List from '@/components/Content/list'
import FileStatusContent from '@/components/Content/fileStatus'
import SearchCondition from '@/components/Content/searchCondition'
import SearchHeader from '@/components/Content/searchHeader'

const routes = [
  {
    path: 'files',
    name: 'Files',
    components: {
      default: Files,
      ContentHeader: FileHeader,
      ContentList: List
    }
  },
  {
    path: 'search',
    name: 'Search',
    components: {
      default: Search,
      ContentHeader: SearchHeader,
      ContentMiddle: SearchCondition,
      ContentList: List
    }
  },
  {
    path: 'filestatus',
    name: 'FileStatus',
    components: {
      default: Files,
      // ContentHeader: FileHeader,
      // ContentMiddle: sortDirMiddle,
      ContentList: FileStatusContent
    }
  },
  {
    path: 'collection',
    name: 'Collection',
    component: Collection
  }
]

export default routes
