let zmq = require('zeromq')
let responder = zmq.socket('rep')

responder.bindSync('tcp://127.0.0.1:3000')
console.log('Producer bound to port 3000')

setInterval(function () {
  responder.send('some work')
}, 1000)
