// 获取真实数据
import getData from './getData'
// 获取模拟数据
import mockData from './easy-mock'

// 是否开启模拟数据
const simulation = false
let fetchData = simulation ? mockData : getData

export default fetchData
