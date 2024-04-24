// liner interpolation

export const lerp = (norm, min, max) => (max - min) * norm + min
export const norm = (value, min, max) => (value - min) / (max - min)
export const range = (value, min1, max1, min2, max2) => 
    lerp(norm(value, min1, max1), min2, max2)
export const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max)

// random

export const uniformRnd = (min, max) => (max - min) * Math.random() + min
export const uniformRndInt = (min, max) => Math.floor(uniformRnd(min, max))

export const normalRnd = (mean = 0.0, stdDev = 1.0) => {
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

// array

export const shuffle = (array) => {
    for(let i = array.length - 1; i > 0; i--) {
        // uniformRndInt(0, i + 1)
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[j], array[i]] = [array[i], array[j]]
    }

    return array
}

export const groupBy = (objects, key) =>
    objects.reduce((acc, curr) => {
        const temp = acc.get(curr[key]) ?? []
        temp.push(curr)
        acc.set(curr[key], temp)
        return acc
    }, new Map())

// angles

export const radian2deg = (r) =>  r * (180 / Math.PI)
export const deg2radian = (d) =>  d * (Math.PI / 180)

// distance

// same as Math.hypot(x1 - x2, y1 - y2)
export const distance = (x1, y1, x2, y2) =>
    Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
