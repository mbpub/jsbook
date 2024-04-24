// assume seq is sorted, O(log(n))
function binarySearch(value, seq, comparer = null) {
    if (!seq || !seq.length) return -1
    comparer = comparer || ((a, b) => (a === b ? 0 : a < b ? -1 : 1))
    let start = 0

    let end = seq.length
    while (start < end) {
        const middle = start + Math.floor((end - start) / 2)
        const r = comparer(seq[middle], value)
        if (r === 0) {
        return middle
        } else if (r < 0) {
        start = middle + 1
        } else {
        end = middle
        }
    }
    return -1
}

// 8 index of 11
console.log(binarySearch(11, [1, 2, 3, 5, 6, 7, 8, 10, 11, 12]))

// -1, not found
console.log(binarySearch(999, [1, 2, 3, 5, 6, 7, 8, 10, 11, 12]))
