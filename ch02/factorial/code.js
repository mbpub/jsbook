function factorial(n) {
    if( n < 0) throw new Error('not implement for negative numbers')
    if(n === 0) return 1
    return n * factorial(n - 1)
}

// 6
console.log(factorial(3))
// 362880
console.log(factorial(9))


function fibonacci(n) {
    // exit case, must be first
    if (n < 2) return n;
    // recursion
    return fibonacci(n - 1) + fibonacci(n - 2)
}

// 21
console.log(fibonacci(8))

const cache = [0, 1]
function fibonacci2(n) {
    // exit
    cache[n] = cache[n] !== undefined
        ? cache[n]
        : fibonacci2(n - 1) + fibonacci2(n - 2)
    return cache[n]
}

console.log(fibonacci2(8))
