/*
 * LoadContent 模块管理 sidebar 和 content 的命名路由视图
 * sidebar 为默认的路由视图，content 为命名路由视图
 */
// sidebar 的组件
import Files from '@/components/Sidebar/Files'
import Search from '@/components/Sidebar/search'
import FileInfo from '@/components/FileAside/fileInfo'
import FileStatus from '@/components/FileAside/fileStatus'
import Collection from '@/components/Sidebar/collection'
// content 的组件
import FileHeader from '@/components/Content/diskDirHeader'
import List from '@/components/Content/list'
import FileStatusContent from '@/components/Content/fileStatus'
import SearchHeader from '@/components/Content/searchHeader'
import UploadFile from '@/components/Content/uploadFile'
import ContentBottom from '@/components/Content/contentBottom'
const routes = [
  {
    path: 'files',
    name: 'Files',
    components: {
      default: Files,
      ContentHeader: FileHeader,
      ContentBottom: ContentBottom,
      FileInfo: FileInfo
    },
    children: [
      {
        path: 'uploadfile',
        name: 'UploadFile',
        component: UploadFile
      },
      {
        path: 'list',
        name: 'List',
        component: List
      }
    ]
  },
  {
    path: 'search',
    name: 'Search',
    components: {
      default: Search,
      ContentHeader: SearchHeader,
      ContentBottom: ContentBottom
    }
  },
  {
    path: 'filestatus',
    name: 'FileStatus',
    components: {
      default: Files,
      ContentBottom: FileStatusContent,
      FileInfo: FileStatus
    }
  },
  {
    path: 'collection',
    name: 'Collection',
    component: Collection
  }
]

export default routes
