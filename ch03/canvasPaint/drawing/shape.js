export default class Shape {

    constructor() {
        this.clear()
        this.color = '#000000'
    }

    clear() {
        this.isDrawing = false
        this.lastMouseMove = null
    }

    get currentShape() {
        return this
    }

    get hasCurrentShape() {
        return !!this.currentShape
    }

    createStart(point) {
        if(point) {
            this.isDrawing = true
            return true
        }

        return false
    }

    createMove(point) {
        if(this.isDrawing) {
            this.lastMouseMove = point
            return true
        }

        return false
    }

    createAdd(point) {
        if(!this.isDrawing) {
            return false
        }

        return true
    }

    createUp(point) {
        if(!this.isDrawing) {
            return false
        }

        return true
    }

    createEnd(point) {
        this.isDrawing = false
        return true
    }

    get isValid() {
        return this.length > 0
    }

    get length() {
        return 0
    }

    undo() {
        if (!this.isValid) {
            return false
        }

        return true
    }

    boundingBox() {
        return null
    }

    draw(ctx) {
    }
}