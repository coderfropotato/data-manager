import $ from 'jquery'
import Tree from '@/components/Sidebar/tree'
import {mapState} from 'vuex'

// 遍历原始数据，改成能被文件树组件使用的数据格式
function travelTree (obj, data) {
  for (let name in obj) {
    // 文件夹
    if (name === '__info__') {
      continue
    }
    if (Object.keys(obj[name]).length > 1) {
      let temp = {
        label: name.toString(),
        children: []
      }
      data.push(temp)
      travelTree(obj[name], data[data.length - 1].children)
    } else {
      let temp = {
        label: name.toString()
      }
      data.push(temp)
    }
  }
}

export default {
  name: 'AllFiles',
  data () {
    return {
      count: 1,
      // 处理完成后的分类文件夹树
      sortFileTree: [],
      // 控制面板折叠与展开
      show: {
        allFiles: true,
        sortFiles: true,
        others: true
      },
      // 折叠或展开按钮的状态
      content: {
        allFiles: '收起',
        sortFiles: '收起',
        others: '收起'
      }
    }
  },
  mounted () {
    this.insertFileIcon()
    this.handleRowData()
  },
  computed: mapState({
    // 所有文件选项的数据，即管理的磁盘
    diskDir: state => state.files.allFiles,
    // 分类的文件夹树，原始数据
    sortDir: state => state.files.sortDir
  }),
  methods: {
    // 插入文件Icon
    insertFileIcon () {
      let Icon = '<svg class="icon" aria-hidden="true">\n' + '<use xlink:href="#icon-wenjian"></use>\n' + '</svg>'
      let downIcon = $('.el-tree-node__expand-icon')
      $(Icon).insertAfter(downIcon)
      $('.el-tree-node__content > .icon')
        .css('font-size', '1.2em')
        .css('margin-right', '0.5em')
        .css('vertical-align', '-0.25em')
    },
    // 文件夹展开或收起
    trigShow (e) {
      let dir
      if ($(e.target).data('name')) {
        dir = $(e.target).data('name')
        // 收起
        if (this.show[dir]) {
          this.content[dir] = '展开'
        } else {
          // 展开
          this.content[dir] = '收起'
        }
        this.show[dir] = !this.show[dir]
      } else if ($(e.target).parent().data('name')) {
        dir = $(e.target).parent().data('name')
        if (this.show[dir]) {
          this.content[dir] = '展开'
        } else {
          this.content[dir] = '收起'
        }
        this.show[dir] = !this.show[dir]
      }
    },
    // 将后台获取的原始文件树数据转化成能展现的格式
    handleRowData () {
      for (let name in this.sortDir) {
        console.log(this.sortDir[name])
        travelTree(this.sortDir[name], this.sortFileTree)
      }
    }
  },
  components: {
    Tree
  }
}
