

// 2D array

const rows = 5
const cols = 4
const matrix = new Array(rows)
for(let rowIdx = 0; rowIdx <matrix.length; rowIdx++) {
    matrix[rowIdx] = new Array(cols)
}

console.table(matrix)

for(let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
    for(let colIdx = 0; colIdx <  matrix[rowIdx].length; colIdx++ ) {
        matrix[rowIdx][colIdx] = 
			rowIdx * (matrix.length - 1) + colIdx
    }
}

console.table(matrix)

// to read
matrix.map((row, rowIdx) => row.map((col, colIdx) =>
	console.log('r,c=', rowIdx, colIdx, matrix[rowIdx][colIdx])))

// to modify in place
matrix.forEach((row, rowIdx) => row.forEach((col, colIdx) =>
	matrix[rowIdx][colIdx] = rowIdx === colIdx ? 1 : 0))

console.table(matrix)

//------------------

const matrix1 = new Array(rows * cols)
for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
        const index = j + i * cols
        matrix1[index] = `${i},${j}`
    }
}

console.log(matrix1)


// looping

const array = [1, 3, 4, 7, 10, 7, 5]

for(let i = 0; i < array.length; i++) {
    console.log(array[i])
}

for(const item of array) {
    console.log(item)
}

array.forEach((item, index) => console.log(item))

array.map((item, index) => console.log(item))

console.log('filter.reduce', array
    .filter(item => item >= 5)
    .reduce((accumulator, item) => accumulator += item, 0))

// true
console.log('every > 0', array
    .every(item => item >= 0))
// true
console.log('some is 5', array
    .some(item => item === 5))

/* (37) [
'1', '3', '3', '3', 
'4', '4', '4', '4', 
'7', '7', '7', '7', '7', '7', '7', 
'10', '10', '10', '10', '10', '10', '10', '10', '10', '10',
'7', '7', '7', '7', '7', '7', '7', 
'5', '5', '5', '5', '5'] */
console.log('flatMap', array
    .flatMap(item => new Array(item).fill(item.toString())))


//------------------------------

const norm = (value, min, max) => (value - min) / (max - min)

// const max = Math.max(...arr)
// const max = array.reduce((a, b) => Math.max(a, b), -Infinity)
// const min = Math.min(...arr)
// const min = array.reduce((a, b) => Math.min(a, b), Infinity)

const minMax = array
    .reduce((a, b) => [Math.min(a[0], b), Math.max(a[1], b)], [Infinity, -Infinity])

console.log('min, max', minMax[0], minMax[1])

// ['0.00', '0.22', '0.33', '0.67', '1.00', '0.67', '0.44']
console.log(array.map(value => norm(value, minMax[0], minMax[1]).toFixed(2)))

// ---------------------------

function reverse(array) {
    const middle = Math.floor(array.length / 2)
    for(let i = 0; i <= middle; i++) {
        // swap via destructuring assignment
        [ array[i], array[array.length - 1 - i] ] 
            = [ array[array.length - 1 - i], array[i] ]
    }

    return array
}

console.log(reverse([1, 2, 4, 5 ]))

