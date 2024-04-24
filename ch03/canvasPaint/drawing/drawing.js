import Shape from './shape.js'
import Path from './path.js'
import Circle from './circle.js'
import Vector from '../vector.js'

export default class Drawing extends Shape {

    constructor() {
        super()
        this.elements = []
    }

    static createElement(type) {
        switch (type) {
            case 'path':
                return new Path()
            case 'circle':
                return new Circle()
            default:
                return null
        }
    }

    clear() {
        super.clear()
        this.elements = []
    }

    add(element, isDrawing = true) {
        if (element) {
            this.elements.push(element)
            this.isDrawing = isDrawing
            return true
        }

        return false
    }

    get currentShape() {
        return this.isDrawing ? this.last : null
    }

    #onCurrentDone() {
        this.isDrawing = false
        if(this.length && !this.last.isValid) {
            this.elements.pop()
        }
    }

    get last() {
        return this.length
            ? this.elements[this.length - 1]
            : null
    }

    createStart(point) {
        if(!this.hasCurrentShape) return false
        if(!this.currentShape.createStart(point)) {
            this.#onCurrentDone()
            return false
        }

        return true
    }

    createMove(point) {
        if(!this.hasCurrentShape) return false
        if(!this.currentShape.createMove(point)) {
            this.#onCurrentDone()
            return false
        }

        return true
    }

    createAdd(point) {
        if(!this.hasCurrentShape) return false
        if(!this.currentShape.createAdd(point)) {
            this.#onCurrentDone()
            return false
        }

        return true
    }

    createUp(point) {
        if(!this.hasCurrentShape) return false
        if(!this.currentShape.createUp(point)) {
            this.#onCurrentDone()
            return false
        }

        return true
    }

    createEnd(point) {
        if(!this.hasCurrentShape) return false
        this.currentShape.createEnd(point)
        this.#onCurrentDone()
        return true
    }

    get length() {
        return this.elements.length
    }

    undoCurrent() {
        if(!this.hasCurrentShape) return false
        this.currentShape.undo()
        if(!this.currentShape.isValid) {
            this.#onCurrentDone()
        }

        return true
    }

    undo() {
        if (!this.isValid) {
            return false
        }

        this.last.undo()
        if (!this.last.isValid) {
            this.isDrawing = false
            this.elements.pop()
        }
    }

    boundingBox() {
        const valid = this.elements.filter(_ => _.isValid)

        if(!valid.length) {
            return null
        }

        const box = valid[0].boundingBox()
        for(let i = 1; i < valid.length; i++) {
            const temp = valid[i].boundingBox()
            if(temp.top.x < box.top.x) {
                box.top.x = temp.top.x
            }

            if(temp.top.y < box.top.y) {
                box.top.y = temp.top.y
            }

            if(temp.bottom.x > box.bottom.x) {
                box.bottom.x = temp.bottom.x
            }

            if(temp.bottom.y > box.bottom.y) {
                box.bottom.y = temp.bottom.y
            }
        }

        box.center = Vector.middle(box.top, box.bottom)
        return box
    }

    draw(ctx) {
        ctx.save()

        this.elements.forEach(e => {
            if(e.isValid) {
                e.draw(ctx)
            }
        })

        ctx.restore()
    }
}
