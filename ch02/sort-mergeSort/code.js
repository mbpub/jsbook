function sort(array, comparer = null) {
    if (!array) return null
    if (!array.length) return []
    if (array.length === 1) return [array[0]] // clone to be consistent
    comparer = comparer || ((a, b) => a === b ? 0 : (a < b ? -1 : 1))
    return _sort(array, 0, array.length, comparer)
}

// array = [start, end)
function _sort(array, start, end, comparer) {
    const length = end - start
    if (length <= 0) return []
    // we only slice at single element level
    if (length === 1) return [array[start]] 
    const middle = start + Math.floor(length / 2)
    // we do not sort in place
    // and we avoid js slice calls on original array
    const left = _sort(array, start, middle, comparer) // left
    const right = _sort(array, middle, end, comparer) // right
    return _merge(left, right, comparer)
}

function _merge(left, right, comparer) {
    const sorted = []
    let l = 0
    let r = 0
    while (l < left.length && r < right.length) {
      if (comparer(left[l], right[r]) < 0) {
        sorted.push(left[l])
        l++
      } else {
        sorted.push(right[r])
        r++
      }
    }
    while (l < left.length) {
      sorted.push(left[l])
      l++
    }
    while (r < right.length) {
      sorted.push(right[r])
      r++
    }
    return sorted
}


  const a = [5, 2, 4, 6, 1, 3]
// [1, 2, 3, 4, 5, 6]
console.log(sort(a))
