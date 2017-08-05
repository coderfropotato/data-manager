import NewFile from '@/components/NewFile/newFile'
import NewDiskDir from '@/components/NewFile/newDiskFile'
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
        component: NewDiskDir
      },
      {
        path: 'newsmartsortdir',
        component: NewSmartSortdir
      },
      {
        path: 'newDialog',
        component: NewDialog
        component: NewDiskDirectory
      }
    ]
  }
]

export default routes
