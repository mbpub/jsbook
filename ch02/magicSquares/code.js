function generate(n) {
    if (n <= 0) return null
    if (n % 2 === 0) throw new Error('only odd squares are supported')
    // n x n matrix
    const size = n * n
    const m = new Array(n).fill(null).map(_ => new Array(n).fill(0))

    let row = 0 // row index
    let col = (n - 1) / 2 // col index
    let k = 0 // value

    while (k++ < size) {
        m[row][col] = k
        // diagonally top-right
        const nextRow = (row + n - 1) % n
        const nextCol = (col + 1) % n
        // if not free, move one row down
        if (m[nextRow][nextCol] !== 0) {
            row = (row + 1) % n  
        } else {
            row = nextRow
            col = nextCol
        }
    }

    return m
}

console.table(generate(1))
console.table(generate(3))
console.table(generate(5))
console.table(generate(7))