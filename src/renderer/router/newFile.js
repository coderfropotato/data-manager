import NewFile from '@/components/NewFile/newFile'
import NewDiskDir from '@/components/NewFile/newDiskFile'

const routes = [
  {
    path: '/newfile',
    name: 'NewFile',
    component: NewFile,
    children: [
      {
        path: 'newdiskdir',
        component: NewDiskDir
      }
    ]
  }
]

export default routes
