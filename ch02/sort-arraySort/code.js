const a = [5, 2, 4, 6, 1, 3]
console.log(a.sort())

// this is the same as default above
console.log(a.sort((a, b) => a - b))

// this will reverse the sort order
// from ascending to descending
console.log(a.sort((a, b) => b - a))

// not ok, no one does this
console.log('random1', a.sort((a, b) => {
    const r = Math.random()
    console.log(a, b, r)
    return r >= 0.5 ? 1 : -1
}))

// needs memoization, no one does this
const cache = []
console.log('random2', a.sort((a, b) => {

    // case: existing pair a, b
    let found = cache.find(pair => pair[0] === a && pair[1] === b)
    if(found) return found[3]

    // case:  existing pair b, a
    found = cache.find(pair => pair[0] === b && pair[1] === b)
    if(found) return -found[3]

    // case: new pair a, b 
    const r = Math.random() >= 0.5 ? 1 : -1
    cache.push([a, b, r])
    return r
}))

