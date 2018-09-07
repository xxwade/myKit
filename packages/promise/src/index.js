function Promise (excutor) {
  this.status = 'pending'
  this.value = null
  this.reason = null
  this.onFullfillCallbacks = []
  this.onRejectCallbacks = []

  function resolve (val) {
    this.value = val
    this.status = 'resolved'
  }

  function reject (reason) {
    this.reason = reason
    this.status = 'rejected'
  }

  try {
    excutor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

Promise.prototype.then = function (onFulfilled, onRjected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
    return value;
  }
  onRjected = typeof onRjected === 'function' ? onRjected : function (err) {
    throw err;
  }

  let promise2
  let _this = this

  if (this.status === 'pending') {
    promise2 = new Promise(function(resolve, reject) {
      this.onFullfillCallbacks.push(function () {
        try {
          let x = onFulfilled(_this.value);
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  return promise2
}