async function pipe (...rest) {
  if (rest.length === 0) {
    return {
      data: 0,
      pipe: pipe
    }
  }

  const fn = rest.shift()

  if (typeof fn !== 'function') {
    return {
      data: fn,
      pipe: pipe
    }
  }

  if (this && this.data) {
    rest.unshift(this.data)
  }

  const result = await fn.apply(this, rest)

  return {
    data: result,
    pipe: pipe
  }
}

function sum(a, b) {
  return a + b;
}

function getVAl () {
  return new Promise((resolve, rejcet) => {
    setTimeout(()=> {
      resolve(10)
    })
  })
}

const add = (x, y) => x + y;
const square = x => x * x;
const divide = (x, y) => x / y;
const double = x => x + x;
const asyncFn = async (x) => {
  const val = await getVAl()
  return x + val
}

// const result = pipe(sum, 1, 2).pipe(sum, 10)

const result1 = (pipe(1)
  // .pipe(add, 1)
  // .pipe(double)
  // .pipe(square)
  // .pipe(divide,  8)
  .pipe(asyncFn))
  // .pipe(add, 10); // 22

console.log(result1)