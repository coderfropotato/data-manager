/*
 * LoadContent 模块管理 sidebar ，content 和 fileAside 的命名路由视图
 * sidebar 为默认的路由视图，content 和 fileAside 为命名路由视图
 */
// sidebar 的组件
const Files = r => require.ensure([], () => r(require('@/views/sidebar/children/files')), 'files')
const FileStatus = r => require.ensure([], () => r(require('@/views/sidebar/children/fileStatus')), 'fileStatus')
// const FileManager = r => require.ensure([], () => r(require('@/components/fileManager')), 'fileManager')
const Search = r => require.ensure([], () => r(require('@/views/sidebar/children/search')), 'search')
const ToolsIndex = r => require.ensure([], () => r(require('@/views/content/children/toolsIndex')), 'ToolsIndex')
const ToolsDetail = r => require.ensure([], () => r(require('@/views/content/children/toolsDetail')), 'ToolsDetail')
const Database = r => require.ensure([], () => r(require('@/views/content/children/database')), 'Database')
// content 的组件
const FileStatusContent = r => require.ensure([], () => r(require('@/views/content/children/fileStatusContent')), 'fileStatusContent')
const FileHeader = r => require.ensure([], () => r(require('@/views/content/children/fileHeader')), 'fileHeader')
const FileContent = r => require.ensure([], () => r(require('@/views/content/children/fileContent')), 'fileContent')
const FileScale = r => require.ensure([], () => r(require('@/views/content/children/fileScale')), 'fileScale')
const SearchHeader = r => require.ensure([], () => r(require('@/views/content/children/searchHeader')), 'searchHeader')
const SearchIndex = r => require.ensure([], () => r(require('@/views/content/children/searchIndex')), 'searchIndex')

const SearchContent = r => require.ensure([], () => r(require('@/views/content/children/searchContent')), 'searchContent')
const ImportFile = r => require.ensure([], () => r(require('@/views/content/children/importFile')), 'importFile')
const DiskDirectory = r => require.ensure([], () => r(require('@/views/content/children/diskDirectory')), 'diskDirectory')
const SmartCategory = r => require.ensure([], () => r(require('@/views/content/children/smartCategory')), 'smartCategory')
const Ignore = r => require.ensure([], () => r(require('@/views/content/children/ignore')), 'ignore')
// fileAside 的组件
const FileInfo = r => require.ensure([], () => r(require('@/views/fileAside/children/fileInfo')), 'fileInfo')
const FileStatusAside = r => require.ensure([], () => r(require('@/views/fileAside/children/fileStatusAside')), 'fileStatusAside')

const routes = [
  {
    path: 'files',
    name: 'Files',
    components: {
      default: Files,
      ContentHeader: FileScale,
      FileInfo: FileInfo
    },
    children: [
      {
        // 导入文件
        path: 'importfile',
        name: 'ImportFile',
        component: ImportFile
      },
      {
        // 文件列表（分类和回收站共用）
        path: 'list',
        name: 'DataDisplay',
        component: SearchContent
      },
      // 磁盘文件
      {
        path: 'diskdirectory',
        name: 'DiskDirectory',
        component: DiskDirectory
      },
      // 忽略文件
      {
        path: 'ignore',
        name: 'Ignore',
        component: Ignore
      }
    ]
  },
  {
    path: "searchfiles",
    name: "SearchFiles",
    components: {
      default: Files,
      ContentHeader: FileHeader,
      ContentBottom: FileContent,
      FileInfo: FileInfo
    }
  },
  {
    path: "searchindex",
    name: "SearchIndex",
    components: {
      default: Search,
      ContentHeader: SearchIndex,
      FileInfo: FileInfo
    },
  },
  {
    path: 'search',
    name: 'Search',
    components: {
      default: Search,
      ContentHeader: SearchHeader,
      ContentBottom: SearchContent,
      FileInfo: FileInfo
    }
  },
  {
    path: 'filestatus',
    name: 'FileStatus',
    components: {
      default: FileStatus,
      ContentBottom: FileStatusContent,
      FileInfo: FileStatusAside
    },
  },
  {
    path:"filestatusinfo",
    name:"FileStatusInfo",
    components:{
      default:FileStatus,
      ContentBottom:FileStatusContent,
      FileInfo:FileInfo
    }
  },
  {
    path: 'toolsIndex',
    name: 'ToolsIndex',
    components: {
      ContentHeader: ToolsIndex
    }
  },
  {
    path: 'toolsDetail',
    name: 'ToolsDetail',
    components: {
      ContentHeader: ToolsDetail
    }
  },
  {
    path: 'database',
    name: 'database',
    components: {
      ContentHeader: Database
    }
  }
]

export default routes
