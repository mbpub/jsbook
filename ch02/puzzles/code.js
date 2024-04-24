// ------------------------------------------

P1:
;

const palindrome = (array) => {
    if(!array || array.length <= 1) return true
    const middle = Math.floor(array.length / 2)
    for(let i = 0; i < middle; i++) {
        if(array[i] !== array[array.length - i - 1]) {
            return false
        }
    }

    return true
}

// true
console.log('palindrome', palindrome([1, 3, 4, 3, 1]))
console.log('palindrome', palindrome([1, 3, 3, 1]))
console.log('palindrome', palindrome([1, 3, 4, 1]))

// ------------------------------------------

// P2 using Map to keep index by array element value to array index
;

const twoSum = (array, target) => {
    const idx = new Map(array.map((e, i) => [e, i]))
    console.log(idx)
    for(let i = 0; i < array.length; i++) {
        const complement = target - array[i]
        const complementIdx = idx.get(complement)
        if(complementIdx !== undefined) {
            return [i, complementIdx]
        }
    }

    return [ -1, -1]
}

// [0, 2]
console.log('twoSum', twoSum([2, 11, 7, 14], 9))

// ------------------------------------------

// P3
;

// O(N*M)
const longestCommonPrefix1 = array => {
    let i = 0
    let stop = false
    while(!stop) {
        for(let j = 1; j < array.length; j++) {
            if((i >= array[j].length)
                || (array[j - 1][i] !== array[j][i])) {
                stop = true
                break
            } 
        }

        if(!stop) i++
    }

    return array[0].substring(0, i)
}

// bo
console.log('longestCommonPrefix1',
    longestCommonPrefix1(['boy', 'bow', 'boom']))

// O(N)
const longestCommonPrefix2 = array => {
    if(!array || (array.length < 2)) return ''
    array.sort()
    const a1 = array[0]
    const a2 = array[array.length - 1]
    let i = 0
    for(; i < Math.min(a1.length, a2.length); i++) {
        if(a1[i] !== a2[i]) break;
    }
    return array[0].substring(0, i)
}

// bo
console.log('longestCommonPrefix2',
    longestCommonPrefix2(['boy', 'bow', 'boom']))



