/*
* 加载新建文件夹的组件，一般都会打开新的窗口
* */
// 智能视图
const NewSmartCategoryDir = r => require.ensure([], () => r(require('@/views/newDirectory/children/newSmartCategory')), 'newSmartCategory')
// 根路由组件
const NewDirectory = r => require.ensure([], () => r(require('@/views/newDirectory/newDirectory')), 'newDirectory')
// 新增目录
const NewDiskDirectory = r => require.ensure([], () => r(require('@/views/newDirectory/children/newDiskDirectory')), 'newDiskDirectory')
// Excel 导入文件
const ExcelImport = r => require.ensure([], () => r(require('@/views/newDirectory/children/excelImport')), 'excelImport')

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
        path: 'newsmartcategorydir',
        component: NewSmartCategoryDir
      },
      {
        path: 'excelImport',
        component: ExcelImport
      }
    ]
  }
]

export default routes
