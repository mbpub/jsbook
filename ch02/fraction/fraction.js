// https://en.wikipedia.org/wiki/Fraction_(mathematics)
// https://en.wikipedia.org/wiki/Euclidean_algorithm

export default class Fraction {

    #numerator
    #denominator

    constructor(numerator, denominator = 1, reduce = false) {
      this.init(numerator, denominator, reduce)
    }
  
    init(numerator, denominator = 1, reduce = false) {
      this.numerator = numerator
      this.denominator = denominator
      if (reduce) this.reduce()
    }
  
    static from() {
      if (!arguments.length) return new Fraction(0, 1)
      const a1 = arguments[0]
      const a1Type = typeof (a1)
      if (a1Type === 'string') return Fraction.fromString(a1)
      if (arguments.length < 2) return Fraction.fromFloat(a1)
  
      // a bit ambiguous here
      if (Number.isInteger(a1)) {
        return new Fraction(a1, arguments[1])
      }
  
      return Fraction.fromFloat(a1, arguments[1])
    }
  
    static fromParts(numerator, denominator = 1, reduce = false) {
      return new Fraction(numerator, denominator, reduce)
    }
  
    static fromString(str) {
      if (!str) throw new Error('invalid')
      const parts = str.split('/', 2)
      const n = parseInt(parts[0])
      const d = parts.length > 1 ? parseInt(parts[1]) : 1
      return new Fraction(n, d)
    }

    get numerator() {
      return this.#numerator
    }
  
    set numerator(value) {
      this.#numerator = Math.floor(value)
    }
  
    get denominator() {
      return this.#denominator
    }
  
    set denominator(value) {
      if (value === 0) throw new Error('NaN')
      this.#denominator = Math.floor(value)
      if (this.#denominator < 0) {
        this.numerator *= -1 // normalize sign
        this.#denominator *= -1
      }
    }
  
    // inverse
    reciprocal(reduce = false) {
      ;[this.numerator, this.denominator] =
        [this.denominator, this.numerator]
      if (reduce) this.reduce()
      return this
    }
  
    clone() {
      return new Fraction(this.numerator, this.denominator)
    }
  
    get isPositive() {
      return this.numerator >= 0
    }
  
    get isWholeNumber() {
      return this.denominator === 1
    }
  
    get isUnit() {
      return this.numerator === 1 || this.numerator === -1
    }
  
    get wholePart() {
      return Math.floor(this.numerator / this.denominator)
    }
  
    get remainderPart() {
      return Math.abs(this.numerator) % this.denominator
    }
  
    cloneToWholeAndRemainder() {
      const clone = this.clone().reduce()
      return [new Fraction(clone.wholePart),
          new Fraction(clone.remainderPart, clone.denominator)]
    }
  
    // greatest common divisor: greatest number that divides two positive numbers a and b without reminder
    // let a = 2^a2 * 3^a3 * 5^a5 * 7^a7 * ... <= prime decomposition of a
    // let b = 2^b2 * 3^b3 * 5^b5 * 7^b7 * ... <= prime decomposition of b
    // gcd(a,b) = 2^min(a2,b2) * 3^min(a3,b3) * 5^min(a5,b5) * 7^min(a7,b7) * ...
    #gcd(a, b) {
      return b === 0 ? a : this.#gcd(b, a % b)
    }
  
    // least common multiple: smallest number that is divisible without a reminder from two positive numbers
    // lcm(a,b) = 2^max(a2,b2) * 3^max(a3,b3) * 5^max(a5,b5) * 7^max(a7,b7) * ...
    // a * b = gcd(a, b) * lcm(a, b)
    #lcm(a, b) {
      return a * (b / this.#gcd(a, b))
    }
  
    reduce() {
      const gcd = this.#gcd(this.numerator > 0
          ? this.numerator
          : -this.numerator, this.denominator)
      this.numerator /= gcd
      this.denominator /= gcd
      return this
    }
  
    simplify() {
      return this.reduce()
    }
  
    #ok(other) {
      return other && other.denominator > 0
    }
  
    same(other) {
      if (!this.#ok(other)) return false
      return this.numerator === other.numerator
        && this.denominator === other.denominator
    }
  
    equals(other) {
      return this.equivalent(other)
    }
  
    equivalent(other) {
      if (!this.#ok(other)) return false
      return this.clone().reduce().same(other.clone().reduce())
    }
  
    switchSign() {
      this.numerator *= -1
      return this
    }
  
    add(other) {
      if (!this.#ok(other)) throw new Error('other')
      //this.numerator = this.numerator * other.denominator
      // + other.numerator * this.denominator
      //this.denominator = this.denominator * other.denominator
      //this.reduce()
  
      //without reduce
      const lcm = this.#lcm(this.denominator, other.denominator)
      this.numerator = this.numerator * (lcm / this.denominator)
        + other.numerator * (lcm / other.denominator)
      this.denominator = lcm
      return this
    }
  
    sub(other) {
      if (!this.#ok(other)) throw new Error('other')
      this.add(other.clone().switchSign())
      return this
    }
  
    mul(other) {
      if (!this.#ok(other)) throw new Error('other')
      this.numerator *= other.numerator
      this.denominator *= other.denominator
      return this
    }
  
    div(other) {
      if (!this.#ok(other)) throw new Error('other')
      return this.mul(other.clone().reciprocal())
    }
  
    compare(other) {
      if (!this.#ok(other)) return -1
      const lcm = this.#lcm(this.denominator, other.denominator)
      const n1 = this.numerator * (lcm / this.denominator)
      const n2 = other.numerator * (lcm / other.denominator)
      return n1 === n2 ? 0 : n1 < n2 ? -1 : 1
    }

    op(operator, other) {
        switch(operator) {
            case '+': return this.add(other)
            case '-': return this.sub(other)
            case '*': return this.mul(other)
            case '/': return this.div(other)
            default:
                throw `unsupported operator ${operator}: supports +_/*`
        }
    }
  
    toFloat() {
      return this.numerator / this.denominator
    }
  
    static fromFloat(value, precision = 10) {
      const isPositive = value >= 0.0
      value = Math.abs(value)
      const intDigits = value < 1 ? 0 : Math.floor(Math.log10(value))
      if (precision < 0) precision = 0
      precision = Math.floor(precision) + intDigits
  
      const temp = 10 ** precision
      const numerator = Math.floor(value * temp)
      const denominator = temp
      return new Fraction(isPositive
          ? numerator
          : -numerator, denominator, true)
    }
  
    toString() {
      return `${this.numerator}/${this.denominator}`
    }
  }
  