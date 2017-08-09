/*
 * LoadContent 模块管理 sidebar 和 content 的命名路由视图
 * sidebar 为默认的路由视图，content 为命名路由视图
 */
// sidebar 的组件
import Files from '@/components/Sidebar/Files'
import Search from '@/components/Sidebar/search'
import FileInfo from '@/components/FileAside/fileInfo'
import fileStatusAside from '@/components/FileAside/fileStatusAside'
import Collection from '@/components/Sidebar/collection'
// content 的组件
import ListHeader from '@/components/Content/fileListHeader'
import List from '@/components/Content/list'
import FileStatusContent from '@/components/Content/fileStatus'
import SearchHeader from '@/components/Content/searchHeader'
import ImportFile from '@/components/Content/importFile'
import ContentBottom from '@/components/Content/contentBottom'
import DiskDirectory from '@/components/Content/diskDirectory'
import SmartSort from '@/components/Content/smartSort'
import Ignore from '@/components/Content/ignore'
const routes = [
  {
    path: 'files',
    name: 'Files',
    components: {
      default: Files,
      ContentHeader: ListHeader,
      ContentBottom: ContentBottom,
      FileInfo: FileInfo
    },
    // ContentBottom
    children: [
      {
        // 导入文件
        path: 'importfile',
        name: 'ImportFile',
        component: ImportFile
      },
      {
        // 文件列表
        path: 'list',
        name: 'List',
        component: List
      },
      {
        path: 'diskdirectory',
        name: 'DiskDirectory',
        component: DiskDirectory
      },
      {
        path: 'ignore',
        name: 'Ignore',
        component: Ignore
      }
    ]
  },
  {
    path: 'search',
    name: 'Search',
    components: {
      default: Search,
      ContentHeader: SearchHeader,
      ContentBottom: List
    }
  },
  {
    path: 'filestatus',
    name: 'FileStatus',
    components: {
      default: Files,
      ContentBottom: FileStatusContent,
      FileInfo: fileStatusAside
    }
  },
  {
    path: 'collection',
    name: 'Collection',
    components: {
      default: Collection
    }
  },
  {
    path: 'smartSort',
    name: 'SmartSort',
    components: {
      default: Files,
      ContentBottom: SmartSort
    }
  }
]

export default routes
