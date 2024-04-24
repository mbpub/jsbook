const array = [
    'image',
    'an array',
    'with many',
    'entries',
    'such as',
    'foo',
    'boo'
]

// used as string hash function
function sum(string) {
    let accumulator = 0

    for(let i = 0; i < string.length; ++i) {
        accumulator = (accumulator + string.charCodeAt(i)) % 0xFFFF
    }

    return accumulator
}

// create hash index data structure
const hashLength = 1024
// 2D array hashLength x []
const hash = new Array(hashLength).fill().map(() => new Array())

// fill hash once
for(const item of array) {
    const itemHash = sum(item)
    const hashIndex = itemHash % hashLength
    if(!hash[hashIndex].includes(item)) {
        hash[hashIndex].push(item)
    } 
}

console.table(hash)

// look-up many times, this can be a function
let queryItem = 'foo'
let found = hash[sum(queryItem) % hashLength].includes(queryItem)
console.log('found foo', found)

queryItem = 'boo'
found = hash[sum(queryItem) % hashLength].includes(queryItem)
console.log('found boo', found)

queryItem = 'xxx'
found = hash[sum(queryItem) % hashLength].includes(queryItem)
console.log('found xxx', found)