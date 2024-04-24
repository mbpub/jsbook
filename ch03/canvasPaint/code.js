import Point from './drawing/point.js'
import Drawing from './drawing/drawing.js'
import ViewPort from './viewport.js'

new class CanvasPaint {

    constructor() {
        this.canvas = document.getElementById('paint')
        this.ctx = this.canvas.getContext('2d')
        this.drawing = new Drawing()

        this.viewPort = new ViewPort(this.canvas.width, this.canvas.height)
        this.lastMouseMove = new Point(0, 0)
        this.dragStart = null

        this.#init()
        this.#animate()
    }


    #init() {
        this.canvas.addEventListener('contextmenu', event => {
            event.preventDefault()
            event.stopPropagation()
        })

        ;['mousedown', 'mousemove', 'mouseup']
            .forEach(_ => this.canvas
                    .addEventListener(_, this[_].bind(this)))
        this.canvas
            .addEventListener('mousewheel',
                this.mousewheel.bind(this), { passive: true })

        for(const button of document.getElementsByTagName('button')) {
            button.addEventListener('click', this[button.id].bind(this))
        }
    }

    get color() {
        return document.getElementById('color').value
    }

    #animate() {
        this.ctx.save()
        this.viewPort.apply(this.ctx, this.lastMouseMove)
        this.drawing.draw(this.ctx)
        this.ctx.restore()
        window.requestAnimationFrame(this.#animate.bind(this))
    }

    mousedown(event) {
        const point = this.viewPort.event2Point(event)

        if(this.#canDrag(event)) {
            this.dragStart = {
                start: new Point(event.offsetX, event.offsetY),
                offset: this.viewPort.offset }
            this.canvas.style.cursor = 'grabbing'
            return
        }

        // right-click
        if(event.button === 2) {
            this.drawing.createEnd(point)
        // middle-click
        } else if(event.button === 1) {
            this.drawing.undoCurrent()
        // left-click
        } else if(event.button === 0) {
            if(!this.drawing.hasCurrentShape) {
                const shape =
                    Drawing.createElement(this.#currentShapeType)
                shape.color = this.color
                if(!this.drawing.add(shape)) {
                    return
                }

                this.drawing.createStart(point)
            } else {
                this.drawing.createAdd(point)
            }
        }
    }

    mouseup(event) {
        const point = this.viewPort.event2Point(event)

        const hasDrag = this.dragStart != null
        this.dragStart = null
        this.canvas.style.cursor = 'default'
        if(hasDrag) return

        this.drawing.createUp(point)
    }

    mousemove(event) {
        this.lastMouseMove = new Point(event.offsetX, event.offsetY)
        const point = this.viewPort.event2Point(event)

        if(this.#canDrag(event) && this.dragStart) {
            this.viewPort.setDragOffset(
                this.dragStart.offset,
                this.dragStart.start,
                this.lastMouseMove)
            return
        }

        this.drawing.createMove(point)
    }
   

    mousewheel(event) {
        if(this.#canDrag(event)) return
        const delta = Math.sign(event.deltaY)
        this.viewPort.addScale(-delta)
    }

    #canDrag(event) {
        return event.altKey
    }

    resetZoom() {
        this.viewPort.setScale(1.0)
        setTimeout(this.center.bind(this), 0)
    }

    center() {
        let center = new Point(this.canvas.width / 2,
            this.canvas.height / 2)
        const box = this.drawing.boundingBox()
        if(box?.center) {
            center = box.center
        }

        this.viewPort.center(center)
    }

    undo() {
        this.drawing.undo()
    }

    clear() {
        this.canvas.style.cursor = 'default'
        this.dragStart = null
        this.drawing.clear()
        this.viewPort.reset()
    }

    save() {
        this.canvas.toBlob(blob => {
            const a = document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = `paint.png`
            a.click()
        })
    }

    help() {
        document.getElementById('tutorial')
            .classList.toggle('hidden')
    }

    get #currentShapeType() {
        const shapes = document.getElementsByName('shape')
        for(let i = 0; i < shapes.length; i++) {
            if(shapes[i].checked) {
                return shapes[i].value
            }
        }
        
        return 'path'
    }
}
