
function toBase(integer, base, encoding) {
    if(!encoding || encoding.length < base) return null
    
    let accumulator = ''
    const digitsInBase = Math.floor(Math.log10(integer) 
        / Math.log10(base)) + 1

    for(let powerIdx = digitsInBase - 1; powerIdx >= 0; powerIdx--) {
        const power = base ** powerIdx
        const symbol = Math.floor(integer / power)
        integer = integer % power
        accumulator += encoding[symbol]
    }

    return accumulator
}

console.log(toBase(142, 2, '01')) // '10001110'
console.log(toBase(142, 8, '01234567')) // '216'
console.log(toBase(142, 10, '0123456789')) // '142'
console.log(toBase(142, 16, '0123456789abcdef')) // '8e'

console.log(toBase(26, 2, '01')) // '11010'
console.log(toBase(26, 8, '01234567')) // '32'
console.log(toBase(26, 10, '0123456789')) // '26'
console.log(toBase(26, 16, '0123456789abcdef')) // '1a'

function fromBase(integerString, base, encoding) {
    if(!encoding || encoding.length < base) return null
    let accumulator = 0
    for(let powerIdx = 0; powerIdx < integerString.length; ++powerIdx) {
        const symbolIndex = integerString.length - 1 - powerIdx;
        const symbol = encoding.indexOf(integerString[symbolIndex])
        // incorrect text or encoding
        if(symbol < 0) return null
        const power = base ** powerIdx
        accumulator += symbol * power
    }
    return accumulator
}

console.log(fromBase('10001110', 2, '01')) // 142
console.log(fromBase('216', 8, '01234567')) // 142
console.log(fromBase('142', 10, '0123456789')) // 142
console.log(fromBase('8e', 16, '0123456789abcdef')) // 142
