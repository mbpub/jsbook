import Fraction from './fraction.js'

const a = new Fraction(3, 6)
// 3/6 1/2 0.5 Fraction {numerator: 1, _denominator: 2}
console.log(a.toString(), a.reduce().toString(), a.toFloat(), a)

const c = Fraction.from('7/4').cloneToWholeAndRemainder()
// 1/1 true 3/4 false 0.75
console.log(c[0].toString(), c[0].isWholeNumber,
    c[1].toString(), c[1].isWholeNumber, c[1].toFloat())
// true
console.log(Fraction.from(0.75).same(c[1]))
// true
console.log(new Fraction(3, 4).equivalent(new Fraction(3 * 21, 4 * 21)))
// 6/4 6/4
console.log(new Fraction(3, 4).op('+', new Fraction(3, 4)).toString(),
    new Fraction(3, 4).add(new Fraction(3, 4)).toString())

// float true
console.log('float',
    Fraction.fromFloat(123.23456, 4).toFloat() - 123.2345 < 0.0001)

console.log(Fraction.from(6, 18).reduce().toString())
console.log(Fraction.from(6, 18).reciprocal().toString())
