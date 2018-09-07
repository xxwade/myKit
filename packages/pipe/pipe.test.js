import pipe from './index'

const add = (x, y) => x + y;
const square = x => x * x;
const divide = (x, y) => x / y;
const double = x => x + x;


test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});


test('pipe: 1 + 2 = 3', () => {
  expect(pipe(add, 1, 2).data).toBe(3);
});

test('pipe: 1 + 2 + 10 = 13', () => {
  const result = pipe(add, 1, 2).pipe(add, 10)

  expect(result.data).toBe(13);
});

test('pipe: complecated', () => {
  const result = pipe(1)
    .pipe(add, 1)
    .pipe(double)
    .pipe(square)
    .pipe(divide, 8)
    .pipe(add, 10); // 12

  expect(result.data).toBe(12);
});