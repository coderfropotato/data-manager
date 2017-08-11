// 数据缓存优化
import localforage from 'localforage'

localforage.config({
  driver: [
    localforage.INDEXEDDB,
    localforage.WEBSQL
  ],
  name: 'DataManager'
})
export default {}
