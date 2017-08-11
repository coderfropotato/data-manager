/*
* 加载新建文件夹的组件，一般都会打开新的窗口
* */
// 智能视图
import NewSmartSortdir from '@/components/NewDirectory/newSmartSort'
// 根路由组件
import NewDirectory from '@/components/NewDirectory/newDirectory'
// 新增目录
import NewDiskDirectory from '@/components/NewDirectory/newDiskDirectory'
// 新增分类
import NewSortDirectory from '@/components/NewDirectory/newSortDirectory'
// Excel 导入文件
import ExcelImport from '@/components/NewDirectory/excelImport'
const routes = [
  {
    path: '/newfile',
    name: 'NewFile',
    component: NewDirectory,
    children: [
      {
        path: 'newdiskdir',
        component: NewDiskDirectory
      },
      {
        path: 'newsmartsortdir',
        component: NewSmartSortdir
      },
      {
        path: 'newsortdir',
        component: NewSortDirectory
      },
      {
        path: 'excelImport',
        component: ExcelImport
      }
    ]
  }
]

export default routes
