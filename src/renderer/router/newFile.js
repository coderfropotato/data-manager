import NewFile from '@/components/NewFile/newFile'
import NewDiskDir from '@/components/NewFile/newDiskFile'
import NewSmartSortdir from '@/components/NewFile/newSmartSort'
import NewDialog from '@/components/NewFile/newDialog'

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
      }
    ]
  }
]

export default routes
