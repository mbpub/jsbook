function insertionSort(a) {
    for (let i = 0; i < a.length; ++i) {
        const current = a[i]
        let j = i
        
        while((j > 0) && (a[j-1] > current)) {
            a[j] = a[j - 1]
            j--
        }

        a[j] = current
        console.log('i=', i, a)
    }
    
    return a
}

// 1, 2, 3, 4, 5, 6
console.log(insertionSort([5, 2, 4, 6, 1, 3]))

function insertionSort2(a) {
    for (let i = 0; i < a.length; ++i) {
        const current = a[i]

        let j = i
        for(; (j > 0) && (a[j-1] > current); j--) {
            a[j] = a[j - 1]
        }

        a[j] = current
        console.log(i, a)
    }
    
    return a
}

// 1, 2, 3, 4, 5, 6
console.log(insertionSort2([5, 2, 4, 6, 1, 3]))
