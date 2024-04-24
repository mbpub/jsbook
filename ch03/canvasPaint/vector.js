import Point from './drawing/point.js'

export default class Vector {
    static at = (x = 0, y = 0) => new Point(x, y)
    
    static x = (p1) => p1.x

    static y = (p1) => p1.y

    static add = (p1, p2) => Vector.at(p1.x + p2.x, p1.y + p2.y)
    
    static sub = (p1, p2) => Vector.at(p1.x - p2.x, p1.y - p2.y)
    
    static scale = (p1, scale) => Vector.at(p1.x * scale, p1.y * scale)

    static distance = (p1, p2) => Vector.magnitude(Vector.sub(p1, p2))

    static magnitude = (p1) => Math.hypot(p1.x, p1.y)

    static direction = (p1) => Math.atan2(p1.y, p1.x)

    static unit = (p1) => Vector.scale(p1, 1 / Vector.magnitude(p1))

    static fromPolar = (magnitude, direction) =>
        Vector.at(magnitude * Math.cos(direction),
                magnitude * Math.sin(direction))
    
    static dot = (p1, p2) => p1.x * p2.x + p1.y * p2.y

    static project = (p1, p2) => {
        const lengthSquare = Vector.dot(p2, p2)
        if(lengthSquare < 0.000001) {
            return new Point(0, 0)
        }

        const scale = Vector.dot(p1, p2) / lengthSquare
        return Vector.scale(p2, scale)
    }

    static abs = (p1) => Vector.at(Math.abs(p1.x), Math.abs(p1.y))

    static toFixed = (p1, decimalDigits = 2) => {
        const toFixed = (x) => {
            const pow = Math.pow(10, decimalDigits)
            return Math.round(x * pow) / pow
        }

        return Vector.at(toFixed(p1.x), toFixed(p1.y))
    }

    static middle = (p1, p2, p = 0.5) =>
        Vector.add(p1, Vector.scale(Vector.sub(p2, p1), p))

    static equals = (p1, p2, epsilon = 0.00001) => {
        const temp = Vector.abs(Vector.sub(p1, p2))
        return (temp.x < epsilon) && (temp.y < epsilon)
    }        

    static mul = Vector.scale

    static amplitude = Vector.magnitude

    static length = Vector.magnitude

    static angle = Vector.direction

    static phase = Vector.direction

    static normalize = Vector.unit

    static lerp = Vector.middle
}