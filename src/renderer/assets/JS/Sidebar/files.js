import $ from 'jquery'
/* eslint-disable */
let jsonText = {
  "1": {
    "1.txt": {
      "__info__": [
        1500352737.4018843,
        8
      ]
    },
    "2.2": {
      "__info__": 1500353369.1058018,
      "3.2": {
        "__info__": 1500353384.4572537
      },
      "3.3": {
        "__info__": 1500353403.5781102
      }
    },
    "2.3": {
      "__info__": 1500353377.0413089
    },
    "2.4": {
      "3": {
        "__info__": 1500529763.7200382,
        "3.txt": {
          "__info__": [
            1500529763.7200382,
            0
          ]
        }
      },
      "__info__": 1500529763.7180367,
      "2.2.txt": {
        "__info__": [
          1500529763.7190385,
          6
        ]
      },
      "2.txt": {
        "__info__": [
          1500529763.7190385,
          7
        ]
      }
    },
    "2.5": {
      "3": {
        "__info__": 1500352768.114436,
        "3.txt": {
          "__info__": [
            1500352784.4852366,
            0
          ]
        }
      },
      "__info__": 1500352747.1045063,
      "2.2.txt": {
        "__info__": [
          1500352761.1454654,
          7
        ]
      },
      "2.txt": {
        "__info__": [
          1500529257.360254,
          7
        ]
      }
    },
    "2.txt": {
      "__info__": [
        1500528958.8454301,
        7
      ]
    }
  }
}
let temp = JSON.stringify(jsonText)
let Obj = JSON.parse(temp)
console.log(Obj)
/* eslint-enable */

export default {
  name: 'AllFiles',
  data () {
    return {
      // 模拟数据
      data: [
        {
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级',
              children: [
                {
                  label: '四级'
                }
              ]
            }]
          }]
        },
        {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      count: 0,
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
    this.insertFileIcon()
  },
  methods: {
    // 遍历树
    travelTree (obj) {
      for (let name in obj) {
        // console.log(this.count + ':' + name)
        if (obj[name] instanceof Array) {
          this.count++
          for (let i = 0; i < obj[name].length; i++) {
            this.travelTree(obj[name][i])
          }
          this.count--
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
  }
}