/*
* 用于提供模拟数据，
*/
const allFiles = ['我的电脑', 'USB_154', 'Sandisk01', 'Sandisk02']
const sortDir = [
  {
    '1': {
      '1.txt': {
        '__info__': [
          1500352737.4018843,
          8
        ]
      },
      '2.2': {
        '__info__': 1500353369.1058018,
        '3.2': {
          '__info__': 1500353384.4572537
        },
        '3.3': {
          '__info__': 1500353403.5781102
        }
      },
      '2.3': {
        '__info__': 1500353377.0413089
      },
      '2.4': {
        '3': {
          '__info__': 1500529763.7200382,
          '3.txt': {
            '__info__': [
              1500529763.7200382,
              0
            ]
          }
        },
        '__info__': 1500529763.7180367,
        '2.2.txt': {
          '__info__': [
            1500529763.7190385,
            6
          ]
        },
        '2.txt': {
          '__info__': [
            1500529763.7190385,
            7
          ]
        }
      },
      '2.5': {
        '3': {
          '__info__': 1500352768.114436,
          '3.txt': {
            '__info__': [
              1500352784.4852366,
              0
            ]
          }
        },
        '__info__': 1500352747.1045063,
        '2.2.txt': {
          '__info__': [
            1500352761.1454654,
            7
          ]
        },
        '2.txt': {
          '__info__': [
            1500529257.360254,
            7
          ]
        }
      },
      '2.txt': {
        '__info__': [
          1500528958.8454301,
          7
        ]
      }
    }
  }
  // {
  //   '1': {
  //     '1.txt': {
  //       '__info__': [
  //         1500352737.4018843,
  //         8
  //       ]
  //     },
  //     '2.2': {
  //       '__info__': 1500353369.1058018,
  //       '3.2': {
  //         '__info__': 1500353384.4572537
  //       },
  //       '3.3': {
  //         '__info__': 1500353403.5781102
  //       }
  //     },
  //     '2.3': {
  //       '__info__': 1500353377.0413089
  //     },
  //     '2.4': {
  //       '3': {
  //         '__info__': 1500529763.7200382,
  //         '3.txt': {
  //           '__info__': [
  //             1500529763.7200382,
  //             0
  //           ]
  //         }
  //       },
  //       '__info__': 1500529763.7180367,
  //       '2.2.txt': {
  //         '__info__': [
  //           1500529763.7190385,
  //           6
  //         ]
  //       },
  //       '2.txt': {
  //         '__info__': [
  //           1500529763.7190385,
  //           7
  //         ]
  //       }
  //     },
  //     '2.5': {
  //       '3': {
  //         '__info__': 1500352768.114436,
  //         '3.txt': {
  //           '__info__': [
  //             1500352784.4852366,
  //             0
  //           ]
  //         }
  //       },
  //       '__info__': 1500352747.1045063,
  //       '2.2.txt': {
  //         '__info__': [
  //           1500352761.1454654,
  //           7
  //         ]
  //       },
  //       '2.txt': {
  //         '__info__': [
  //           1500529257.360254,
  //           7
  //         ]
  //       }
  //     },
  //     '2.txt': {
  //       '__info__': [
  //         1500528958.8454301,
  //         7
  //       ]
  //     }
  //   }
  // }
]
export const searchConditions = [
  {
    'sex': ['雌性', '雄性']
  },
  {
    'age': ['16-20', '30-50', '60-80']
  },
  {
    'strain': ['高茎', '低茎']
  }
]
export const smartSort = ['uzi', 'mlxg', 'korol', 'xiaohu']
// export const newSmartSort = [
//   {
//     label: '智能视图一'
//
//   },
//
// ]
export const updateFileTree = [
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
]

export function returnRadomFileList () {
  let fileInfo = [
    {
      name: 'NLFJLDSlsfj',
      createTime: '2017/8/1',
      size: '342KB'
    },
    {
      name: '二次文件',
      createTime: '2017/3/2',
      size: '42KB'
    },
    {
      name: 'zheshi文件',
      createTime: '2017/2/2',
      size: '412KB'
    },
    {
      name: '二次件',
      createTime: '2017/2/1',
      size: '452KB'
    },
    {
      name: '二次fads件',
      createTime: '2017/3/16',
      size: '442KB'
    }
  ]
  const fileList = []
  for (let i = 0; i < 10; i++) {
    let radomIndex = parseInt(Math.random() * 5)
    let obj = {}
    for (let attr in fileInfo[radomIndex]) {
      obj[attr] = fileInfo[radomIndex][attr]
    }
    fileList.push(obj)
  }
  return fileList
}

export const Files = {
  allFiles,
  sortDir
}

export const fileInfo = {
  basicInfo: {
    name: '这是一个测试文件',
    type: '类型',
    createTime: '2015/4/3',
    size: '32KB'
  },
  otherInfo: {
    sourceData: {
      type: '网络',
      name: '谷歌',
      url: 'www.google.com'
    },
    attr: {
      type: 'name'
    }
  }
}

export const modifiedFiles = {
  '84ABB9FB': {
    'tmp': {
      'pycalcdist': {
        'api': {
          'test': {
            '__info__': {
              'ctime': 1501639393.6212525,
              'status': -1
            },
            'test': {
              '__info__': {'ctime': 1501639406.4304078, 'status': -1},
              'test.txt': {'__info__': {'ctime': 1501639413.5577712, 'size': 0, 'status': -1}}
            },
            'test.txt': {'__info__': {'ctime': 1501639401.677846, 'size': 0, 'status': -1}}
          },
          'zmq': {
            'hello': {
              '__info__': {'ctime': 1501639324.373802, 'status': -1},
              'world.txt': {'__info__': {'ctime': 1501639332.9580536, 'size': 0, 'status': -1}}
            }
          }
        }
      }
    }
  },
  'B49EC726': {
    'Xshell 5': {
      'Theme': {
        'hello.txt': {
          '__info__': {
            'ctime': 1501640748.1903245,
            'size': 0,
            'status': 0
          }
        }
      }
    }
  }
}
export default {
  smartSort,
  searchConditions
}
