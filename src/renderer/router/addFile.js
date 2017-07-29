import AddFile from '@/components/AddFile/addFile'
import AddRemoteFile from '@/components/AddFile/addRemoteFile'
import AddLocalFile from '@/components/AddFile/addLocalFile'
const routes = [
  {
    path: '/addfile',
    name: 'AddFile',
    component: AddFile
  },
  {
    path: '/addremotefile',
    name: 'AddRemoteFile',
    component: AddRemoteFile
  },
  {
    path: '/addlocalfile',
    name: 'AddLocalFile',
    component: AddLocalFile
  }
]

export default routes
