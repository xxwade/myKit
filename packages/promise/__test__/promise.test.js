const Promise = require('es6-promise').Promise;

const promise = new Promise((resolve, reject) => {
  resolve(1)
})

promise.then((d) => {
  console.log(d)
})

console.log(2)


function test(){
  console.log('test1')
}

function pp (fn) {
  fn()
}

new pp(test)

console.log('test2')