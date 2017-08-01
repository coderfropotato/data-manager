import {ipcRenderer} from 'electron'

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
      },
      middleHeight: 400
    }
  },
  mounted () {
    // 设置中间文件树区域的高度
    this.$refs.middle.style.height = this.middleHeight + 'px'
    // 当窗口大小发生改变时重新设置高度
    window.addEventListener('resize', () => {
      this.setMiddleHeight()
      this.$refs.middle.style.height = this.middleHeight + 'px'
    }, false)
  },
  methods: {
    openFile () {
      // 向后台发送请求，获取文件树
      this.$store.dispatch('openFile')
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
    },
    updateStyle () {
      if (this.$refs.middleInner.clientHeight > this.middleHeight) {
        this.$refs.middle.style.overflowY = 'scroll'
      } else {
        this.$refs.middle.style.overflowY = 'visible'
      }
    },
    setMiddleHeight () {
      this.middleHeight = window.innerHeight -
      this.$refs.navMenu.clientHeight -
      this.$refs.line.clientHeight -
      this.$refs.bottom.clientHeight -
      32
    }
  }
}
