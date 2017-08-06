import NewSmartSortdir from '@/components/NewDirectory/newSmartSort'
import NewFile from '@/components/NewDirectory/newFile'
import NewDiskDirectory from '@/components/NewDirectory/newDiskDirectory'

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
      }
    ]
  }
]

export default routes
