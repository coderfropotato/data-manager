import localforage from 'localforage'

localforage.config({
  driver: [
    localforage.INDEXEDDB,
    localforage.WEBSQL
  ],
  name: 'DataManager'
})

localforage.setItem('one', {one: '1', two: '2'}).then(function (value) {
}).catch(function (err) {
  console.log(err)
})

export default {}
