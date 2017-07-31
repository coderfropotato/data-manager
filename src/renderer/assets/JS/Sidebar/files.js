import $ from 'jquery'
import Tree from '@/components/Sidebar/tree'
// import fs from 'fs'
// // 读取文件测试
// let filePath = '/Users/wuyiqing/Desktop/datas.json'
// let sourcedata = []
//
// function travelTree (obj, data) {
//   for (let name in obj) {
//     // 文件夹
//     if (name === '__info__') {
//       continue
//     }
//     if (Object.keys(obj[name]).length > 1) {
//       let temp = {
//         label: name.toString(),
//         children: []
//       }
//       data.push(temp)
//       travelTree(obj[name], data[data.length - 1].children)
//     } else {
//       let temp = {
//         label: name.toString()
//       }
//       data.push(temp)
//     }
//   }
// }
//
// // 读取文件
// fs.readFile(filePath, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
//   if (err) {
//     console.error(err)
//     return
//   }
//   var Obj = JSON.parse(data)
//   travelTree(Obj, sourcedata)
// })

export default {
  name: 'AllFiles',
  data () {
    return {
      // 模拟数据
      treeData: [
        {
          name: 'My Tree',
          children: [
            {name: 'hello'},
            {name: 'wat'},
            {
              name: 'child folder',
              children: [
                {
                  name: 'child folder',
                  children: [
                    {name: 'hello'},
                    {name: 'wat'}
                  ]
                },
                {name: 'hello'},
                {name: 'wat'},
                {
                  name: 'child folder',
                  children: [
                    {name: 'hello'},
                    {name: 'wat'}
                  ]
                }
              ]
            }
          ]
        }
      ],
      count: 1,
      show: {
        allFiles: true,
        sortFiles: true,
        others: true
      },
      content: {
        allFiles: '收起',
        sortFiles: '收起',
        others: '收起'
      }
    }
  },
  mounted () {
    // this.travelTree(this.data[1])
    // 在文件名前添加 Icon
    // this.data = sourcedata
    this.insertFileIcon()
  },
  methods: {
    // 遍历树
    travelTree (obj) {
      for (let name in obj) {
        // console.log(this.count + ':' + name)
        if (obj[name] instanceof Array) {
          // this.count++
          this.travelTree(obj[name])
          // this.count--
        }
      }
    },
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
    }
  },
  components: {
    Tree
  }
}
