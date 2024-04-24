import Vector from '../vector.js'
import Shape from './shape.js'

export default class Circle extends Shape {
    constructor(start = null, end = null) {
        super()
        this.start = start
        this.end = end
    }

    clear() {
        super.clear()
        this.start = null
        this.end = null 
    }

    createStart(point) {
        if(!super.createStart(point)) {
            return false
        }

        this.start = point
        return true
    }

    createAdd(point) {
        if(!super.createAdd(point)) {
            return false
        }

        this.isDrawing = false
        this.end = point
        return false
    }

    createUp(point) {
        return this.createAdd(point)
    }

    createEnd(point) {
        return this.createAdd(point)
    }

    get length() {
        return this.start ? 1 : 0
    }

    undo() {
        if(!this.isValid) {
            return false
        }

        
        this.start = null
        this.end = null
        return true
    }

    boundingBox() {
        if(!this.start || !this.end) {
            return null
        }

        return { top: this.start.clone(), bottom: this.end.clone() }
    }

    draw(ctx) {
        if(!this.start) {
            return
        }

        ctx.save()
        ctx.strokeStyle = this.color

        let end = this.end
        if(this.isDrawing && this.lastMouseMove) {
            end = this.lastMouseMove
            ctx.setLineDash([4, 4])
        }

        if(end) {
            ctx.beginPath()
            const diff = Vector.scale(Vector.sub(end, this.start), 0.5)
            const c = Vector.add(this.start, diff)
            ctx.ellipse(c.x, c.y, Math.abs(diff.x),
                Math.abs(diff.y), 0, 0, 2 * Math.PI, false)
            ctx.stroke()
        }        

        ctx.restore()
    }

    toString() {
        return `C: ${this.start?.toString()}, ${this.end?.toString()}`
    }
}

