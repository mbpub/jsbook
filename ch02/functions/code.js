const a = 1

function f1() {
    const b = 2
    console.log('f1', a, b)
}

// f1 1 2
f1()

function f12 () {
    console.log('f12', someVariable)
}

let someVariable = 7
// f12 7
f12()
someVariable = 8
// f12 8
f12()

const f2 = function() {
    console.log('f2', a)
}

f2();

console.log('f2 name', f2.name, 'args length', f2.length,
    'prototype', f2.prototype)

const f3 = function(a1, a2) {
    console.log('f3', a, a1, a2, arguments[0], this)
}

// f3 1 undefined undefined undefined undefined
f3();
// f3 1 2 3 2 undefined
f3(2, 3)

// f3 1 4 5 4 null
f3.apply(null, [4, 5])

// f3 1 4 5 4 null
f3.call(null, 4, 5)

// f3 1 4 5 4 999
f3.apply(999, [4, 5])

// f3 1 4 5 4 999
f3.call(999, 4, 5)

const f3Bound = f3.bind(a)
// f3 1 4 5 4 1
f3Bound(4, 5)

const f3Bound2 = f3.bind(a, 555)
// f3 1 555 4 555 1
f3Bound2(4)

// arrow function expression
// no this or arguments here
const f6 = (a1) => {
    // arguments[0] not defined
    // this not defined
    console.log('f6', a1, this)
}

// f6 1 undefined
f6(1);
// f6 1 undefined, no this
f6.call(3, 1)

function f7() {
    console.log('f7')
    return 1
}

function f8() {
    console.log('f8')
    return 2
}

function f9(a, b) {
    return a + b
}

f9(f7(), f8(), f8())

//----------------------------------

// Immediately Invoked Function Expression (IIFE)
// iife 1
;(function someFunc(a) {
    console.log('iife', 1)
})(1)

//----------------------------------

function sum() {
    let accumulator = 0
    for(let i = 0; i < arguments.length; i++) {
        accumulator += arguments[i]
    }
    return accumulator
}

console.log('sum', sum(1, 2, 3))

//----------------

function sum1toN(n) {
    return n * (n + 1) / 2
}

// 5050
console.log('sum1toN', sum1toN(100))

const linearInterpolation = (x, x0, y0, x1, y1) => 
    (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0)

console.log('lp', linearInterpolation(1, 0, 4, 2, 6))


const lerp = (norm, min, max) => (max - min) * norm + min
// 5
console.log('lerp', lerp(0.5, 4, 6))

const norm = (value, min, max) => (value - min) / (max - min)
// 0.5
console.log('norm', norm(2, 1, 3))

const range = (value, min1, max1, min2, max2) => 
    lerp(norm(value, min1, max1), min2, max2)
// 20
console.log('range', range(2, 1, 3, 10, 30))

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
// 3
console.log('clamp', clamp(5, 1, 3))

