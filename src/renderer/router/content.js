// import Content from '@/components/Content/content'
import FileHeader from '@/components/Content/diskDirHeader'
import sortDirMiddle from '@/components/Content/sortDirMiddle'
import List from '@/components/Content/list'

const routes = [
  {
    path: '/content/diskfile',
    name: 'Content',
    components: {
      FileHeader,
      sortDirMiddle,
      List
    }
  }
]

export default routes
