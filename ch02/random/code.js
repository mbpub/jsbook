const uniformRnd = (min, max) => (max - min) * Math.random() + min

const uniformRndInt = (min, max) => Math.floor(uniformRnd(min, max))

const histogram = new Array(10).fill(0)
for(let i = 0; i < 1000; i++) {
    const next = uniformRndInt(0, 10)
    if(next === 10) {
        console.log(next)
    }
    histogram[next]++
}

// result will vary
// (10) [105, 102, 95, 94, 91, 90, 97, 111, 102, 113]
console.log('uniformRndInt', histogram)

//-----------------------

const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
        // uniformRndInt(0, i + 1)
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[j], array[i]] = [array[i], array[j]]
    }

    return array
}

// [5, 9, 3, 6, 10, 2, 7, 1, 4, 8]
console.log('shuffle', shuffle(array))

const array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function shuffle2(array) {
    for(let i = 0; i < array.length - 2; i++)  {
        const j = uniformRndInt(i, array.length)
        ;[array[j], array[i]] = [array[i], array[j]]
    }

    return array
}

// [2, 6, 10, 9, 4, 8, 1, 3, 5, 7]
console.log('shuffle2', shuffle2(array2))