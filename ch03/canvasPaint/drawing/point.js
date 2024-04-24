export default class Point {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    equals(other) {
        return other && other.x === this.x && other.y === this.y
    }

    clone() {
        return new Point(this.x, this.y)
    }

    toString() {
        return `[${this.x}, ${this.y}]`
    }
}
