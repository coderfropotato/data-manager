import {ipcRenderer} from 'electron'
import API from '@/api/index'
export default {
  name: 'Sidebar',
  data () {
    return {
      newDirList: {
        1: {
          title: '新增数据目录',
          url: '/newdiskdir'
        },
        2: {
          title: '新增分类',
          url: '/newsortdir'
        },
        3: {
          title: '新增智能分类',
          url: '/newsmartsortdir'
        },
        4: {
          title: '从搜索结果新建分类',
          url: '/newsortformsearch'
        },
        5: {
          title: '从搜索结果新建智能分类',
          url: '/newsamrtsortformsearch'
        }
      }
    }
  },
  methods: {
    openFile () {
      // 向后台发送请求，获取文件树
      API.openFile()
    },
    openNewWindow (indexPath) {
      // 嵌套路由
      let url = '/newfile' + indexPath
      console.log(url)
      ipcRenderer.send('addFile', {
        API: 'open',
        URL: url,
        fileType: ''
      })
    }
  }
}
