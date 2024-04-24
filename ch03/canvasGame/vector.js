import * as utils from '../../common/utils.js'

// immutable
export default class Vector {
    
    #x
    #y

    static epsilon = 0.00001

    constructor(x = 0.0, y = 0.0) {
        this.#x = x
        this.#y = y
    }

    toArray() {
        return [this.x, this. y]
    }

    static fromArray(value) {
        return new Vector(value[0], value[1])
    }

    add(other) {
        if(!other) return
        return new Vector(this.x + other.x, this.y + other.y)
    }

    sub(other) {
        if(!other) return
        return new Vector(this.x - other.x, this.y - other.y)
    }

    mul(k) {
        return new Vector(this.x * k, this.y * k)
    }

    get length() {
        return Math.sqrt(this.#x * this.#x + this.#y * this.#y)
    }

    get magnitude() {
        return this.length
    }

    toNearZero() {
        let x = this.#x
        let y = this.#y

        if(Math.abs(x) < Vector.epsilon) {
            x = 0
        }

        if(Math.abs(y) < Vector.epsilon) {
            y = 0
        }

        return new Vector(x, y)
    }

    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    clone() {
        return new Vector(this.#x, this.#y)
    }

    static fromRandom(minX, maxX, minY, maxY) {
        return new Vector(utils.uniformRnd(minX, maxX),
            utils.uniformRnd(minY, maxY))
    }

    toString() {
        return `[${this.x.toFixed(4)},${this.y.toFixed(4)}]`
    }

    clampLength(minLength, maxLength) {
        const polar = this.toPolar()
        const length = polar[0]
        if(length < minLength)
        {
            return Vector.fromPolar([minLength, polar[1]])
        }
        else if(length > maxLength) {
            return Vector.fromPolar([maxLength, polar[1]])
        }

        return this.clone()
    }

    rangeLength(max1, max2) {
        const polar = this.toPolar()
        const newLength = utils.range(polar[0], 0, max1, 0, max2)
        return Vector.fromPolar([newLength, polar[1]])
    }

    addAngle(radian) {
        const polar = this.toPolar()
        return Vector.fromPolar([polar[0], polar[1] + radian])
    }

    addAngleDegrees(degrees) {
        return this.addAngle(utils.deg2radian(degrees))
    }

    get direction() {
        return this.angle
    }

    get angle() {
        return Math.atan2(this.y, this.x)
    }

    get angleDegrees() {
        return utils.radian2deg(this.angle)
    }

    toPolar() {
        // length = magnitude, angle = direction
        return [this.length, this.angle]
    }

    static fromPolar(polar) {
        if(polar[0] < 0) {
            throw new Error('length must be positive')
        }
        const temp = new Vector(polar[0] * Math.cos(polar[1]),
            polar[0] * Math.sin(polar[1]))
        return temp
    }

    toPolarString() {
        const polar = this.toPolar()
        return `/_ ${polar[0].toFixed(4)},${polar[1].toFixed(4)}`
    }
}