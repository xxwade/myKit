// 异步的有问题， 应再包裹一层
const isFn = val => typeof val === 'function'
const isPromise = val => val && isFn(val.then)
const isAsyncFn = val => Object.prototype.toString.call(val) === '[object AsyncFunction]'

async function pipe (...rest) {
  if (rest.length === 0) {
    return {
      data: 0,
      pipe: pipe
    }
  }

  const fn = rest.shift()

  if (!isFn(fn)) {
    return {
      data: fn,
      pipe
    }
  }

  if (this && this.data) {
    rest.unshift(this.data)
  }

  const result = fn.apply(this, rest)
  let finalRet = result

  if (isPromise(result)) {
    finalRet = await result
  }


  return {
    data: finalRet,
    pipe: pipe
  }
}

function piped () {

}

export default pipe
