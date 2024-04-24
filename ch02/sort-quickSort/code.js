const a = [5, 2, 4, 6, 1, 3]

function sort(array, comparer = null) {
    if (!array) return null
    comparer = comparer
        || ((a, b) => a === b ? 0 : (a < b ? -1 : 1))
    return _sort(array, comparer)
}

function _sort(array, comparer) {
    if (!array.length) return []
    if (array.length === 1) return [array[0]]

    const equal = []
    const left = []
    const right = []

    const pivotIdx = Math.floor(array.length / 2)
    const pivot = array[pivotIdx]
    array.forEach(_ => {
        const res = comparer(_, pivot)
        if (res === 0) equal.push(_)
        else if (res < 0) left.push(_)
        else right.push(_)
    })

    const leftSorted = _sort(left, comparer)
    const rightSorted = _sort(right, comparer)

    return leftSorted.concat(equal, rightSorted)
}

// [1, 2, 3, 4, 5, 6]
console.log(sort(a))
