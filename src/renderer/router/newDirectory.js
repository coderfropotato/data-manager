import NewSmartSortdir from '@/components/NewFile/newSmartSort'
import NewDialog from '@/components/NewFile/newDialog'
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
      },
      {
        path: 'newDialog',
        component: NewDialog
      }
    ]
  }
]

export default routes
