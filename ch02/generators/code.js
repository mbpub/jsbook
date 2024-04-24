// or function* generator1 { ... }
const generator1 = function* () {
    yield 'a'
    yield 'b'
    yield 'c'
}

const iterator1 = generator1()
for(const current of iterator1) {
    console.log('item', current)
}

const iterator2 = generator1()
let current = iterator2.next()
console.log(current.value, current.done); // a false
current = iterator2.next()
console.log(current.value, current.done); // b false
current = iterator2.next()
console.log(current.value, current.done); // c false
current = iterator2.next()
console.log(current.value, current.done); // undefined true

// Examples:
// -------------------------------

function* fibonacciSequence(count) {
    if (count < 0) count = 1
    if (count === 1) {
        yield 0
        return
    }
    else yield 0

    let current = 1
    let previous = 0

    yield current
    for (let i = 2; i < count; i++) {
        current += previous
        yield current
        previous = current - previous
    }
}

for(const f of fibonacciSequence(1)) {
    console.log(f)
}

for(const f of fibonacciSequence(2)) {
    console.log(f)
}

for(const f of fibonacciSequence(3)) {
    console.log(f)
}

for(const f of fibonacciSequence(9)) {
    console.log(f)
}

// ------

// a shorter, infinite implementation from mdn

function* fibonacci() {
    let current = 1;
    let next = 1;
    while (true) {
      yield current;
      [current, next] = [next, current + next];
    }
  }

// -----------------------------

function* range(start, end, step = 1) {
    if (!step) throw new Error('step')
    const increasing = step > 0
    if (increasing && (start > end)) {
        [start, end] = [end, start]
    }
    if (!increasing && (start < end)) {
        [start, end] = [end, start]
    }
    if (increasing) {
        for (let i = start; i < end; i += step) {
            yield i
        }
    } else {
        for (let i = start; i > end; i += step) {
            yield i
        }
    }
}

for(const item of range(2, 16, 2)) {
    console.log('range', item)
}

//-------------------------------

