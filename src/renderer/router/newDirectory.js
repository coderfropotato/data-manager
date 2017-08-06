import NewSmartSortdir from '@/components/NewDirectory/newSmartSort'
import NewFile from '@/components/NewDirectory/newFile'
import NewDiskDirectory from '@/components/NewDirectory/newDiskDirectory'
import NewSortDirectory from '@/components/NewDirectory/newSortDirectory'
const routes = [
  {
    path: '/newfile',
    name: 'NewFile',
    component: NewFile,
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
      }
    ]
  }
]

export default routes
