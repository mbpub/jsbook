
// https://en.wikipedia.org/wiki/Marsaglia_polar_method

const normalRnd = (mean = 0.0, stdDev = 1.0) => {
    let spare
    let hasSpare = false
    return () => {
        if(hasSpare) {
            hasSpare = false
            return spare * stdDev + mean
        }
    
        let u, v, s
        do {
            u = Math.random() * 2.0 - 1.0
            v = Math.random() * 2.0 - 1.0
            s = u * u + v * v
        } while((s >= 1.0) || (Math.abs(s) < 0.000001))
        
        s = Math.sqrt(-2.0 * Math.log(s) / s)
        spare = v * s
        hasSpare = true
        return mean + stdDev * u * s
    }
}

const normal1 = normalRnd(10, 5)

let histogram = new Map()

for(let i = 0; i < 10000; i++) {
    const next = Math.round(normal1())
    histogram.set(next, (histogram.get(next) || 0) + 1) 
}

const frequencies = [...histogram].sort((a,b) => a[0] - b[0])

const minMax = frequencies
    .map(e => e[1])
    .reduce((a, b) =>
        [Math.min(a[0], b), Math.max(a[1], b)], [Infinity, -Infinity])


import { range } from '../../common/utils.js'

const histogramBars = new Map(frequencies
    .map(e => 
        [e[0], '*'.repeat(range(e[1], minMax[0], minMax[1], 1, 100))]))

console.log(histogramBars)

// stdDev = 1 72.79 %
// stdDev = 2 96.62 %
// stdDev = 3 99.86 %

for(let i = 1; i <= 3; i++) {
    const valuesCount =
        frequencies
            .filter(e => e[0] >= 10 - i * 5 && e[0] <= 10 + i * 5)
            .reduce((acc, e) => acc += e[1], 0)
    console.log('stdDev =', i, (valuesCount / 10000 * 100).toFixed(2), '%')
}
