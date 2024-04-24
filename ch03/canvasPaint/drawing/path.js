import Shape from './shape.js'

export default class Path extends Shape {
    constructor(points = null) {
        super()
        this.points = points ?? []
    }

    clear() {
        super.clear()
        this.points = []
    }

    #addPoint(point) {
        if((this.length > 0)
            && this.points[this.length - 1].equals(point)) {
            return
        }

        this.points.push(point)
    }

    createStart(point) {
        if(super.createStart(point)) {
            this.points = [ point ]
            return true
        }

        return false
    }

    createAdd(point) {
        if(super.createAdd(point)) {
            this.#addPoint(point)
            return true
        }

        return false
    }

    get length() {
        return this.points.length
    }

    undo() {
        if (!super.undo()) {
            return false
        }

        this.points.pop()
        if(this.points.length === 1) {
            this.points.pop()
        }
        
        return true
    }

    boundingBox() {
        if(!this.isValid) {
            return null
        }

        const min = this.points[0].clone()
        const max = this.points[0].clone()

        for(let i = 1; i < this.points.length; i++) {
            const {x, y } = this.points[i]
            if(x < min.x) {
                min.x = x
            }

            if(y < min.y) {
                min.y = y
            }

            if(x > max.x) {
                max.x = x
            }

            if(y > max.y) {
                max.y = y
            }
        }

        return { top: min, bottom: max }
    }

    draw(ctx) {
        ctx.save()

        ctx.strokeStyle = this.color
        ctx.fillStyle = this.color

        if(this.length === 1) {
            ctx.beginPath()
            ctx.arc(this.points[0].x, this.points[0].y, 1, 0, 2 * Math.PI, true);
            ctx.fill()
        } else  if(this.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y)

            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y)
            }

            ctx.stroke()
        }

        if(this.isDrawing && this.lastMouseMove && (this.length > 0)) {
            
            const lastPoint = this.points[this.points.length - 1]
            ctx.setLineDash([4, 4])
            ctx.beginPath()
            ctx.moveTo(lastPoint.x, lastPoint.y)
            ctx.lineTo(this.lastMouseMove.x, this.lastMouseMove.y)
            ctx.stroke()
        }

        ctx.restore()
    }
}



