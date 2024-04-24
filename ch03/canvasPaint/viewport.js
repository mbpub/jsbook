import Point from './drawing/point.js'
import Vector from './vector.js'

export default class ViewPort {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.reset()
    }

    addScale(delta) {
        this.setScale(this.scale + (delta / 10))
        return this.scale
    }

    setScale(scale) {
        scale = Math.min(Math.max(scale, 0.1), 4)
        scale = Vector.toFixed(new Point(scale, scale), 1).x
        
        if(Math.abs(this.scale - scale) < 0.001) {
            return
        }

        this.scale = scale
        this.scaleOffset = Vector.toFixed(Vector.scale(
            new Point(this.width * (this.scale - 1) / 2,
            this.height * (this.scale - 1) / 2), -1 / this.scale))

        return this.scale
    }

    setOffset(offset) {
        this.offset = Vector.toFixed(offset)
        return this.offset
    }

    center(mousePoint) {
        const start = mousePoint ??=
            new Point(this.width / 2, this.height / 2)
        const { center: end } = this.#getViewPort()
        const delta = Vector.scale(Vector.sub(end, start), this.scale)
        this.setOffset(Vector.add(this.offset, delta))
    }

    reset() {
        this.setOffset(new Point(0, 0))
        this.scale = 1.0
        this.scaleOffset = new Point(0, 0)
    }

    setDragOffset(offset, mouseStart, mouseEnd) {
        const delta = Vector.sub(mouseEnd, mouseStart)
        this.setOffset(Vector.add(offset, delta))
        return this.offset
    }

    event2Point(event, transform = true, offset = null, scale = null) {
        let p = new Point(event.offsetX, event.offsetY)
        if(transform) {
            p = this.view2point(p, offset, scale)
        }

        return p
    }

    view2point(point, offset = null, scale = null) {
        offset ??= this.offset
        scale ??= this.scale

        return Vector.sub(Vector.scale(
            Vector.sub(point, offset), 1 / scale), this.scaleOffset)
    }

    #getViewPort() {
        return this.#getDefaultViewPort(this.view2point.bind(this))
    }

    #getDefaultViewPort(transform) {
        let top = new Point(0, 0)
        let bottom = new Point(this.width, this.height)
        if(transform) {
            top = transform(top)
            bottom = transform(bottom)
        }

        const size = Vector.abs(Vector.sub(bottom, top))
        const center = Vector.middle(top, bottom)
        return { top, bottom, size, center }
    }

    apply(ctx, lastMouseMove) {
        ctx.translate(this.offset.x, this.offset.y)      
        ctx.scale(this.scale, this.scale)
        ctx.translate(this.scaleOffset.x, this.scaleOffset.y)

        const { top, bottom, size, center } = this.#getViewPort()
        ctx.clearRect(
            top.x,
            top.y,
            size.x,
            size.y)

        // debug
        if(false) {
            const vp2 = this.#getDefaultViewPort()
            const mvp = this.view2point(lastMouseMove)
            //const mvp2 = this.point2view(vp2.center)
            ctx.fillText(`p=${
                    lastMouseMove.toString()}, v2p=${
                    Vector.toFixed(mvp, 1).toString()}, center=${
                    Vector.toFixed(center, 1).toString()}`,
                    mvp.x + 20, mvp.y + 20)

            this.#drawCross(ctx, top, bottom, center, false)
            this.#drawCross(ctx, vp2.top, vp2.bottom, vp2.center, true)
        }
    }

    #drawCross(ctx, top, bottom, center, dashed) {
        ctx.save()
        ctx.globalAlpha = 0.2
        ctx.strokeStyle = 'blue'
        if(dashed) {
            ctx.setLineDash([4, 4])
            ctx.lineWidth = 4
        }

        ctx.beginPath()
        ctx.moveTo(center.x, top.y)
        ctx.lineTo(center.x, bottom.y)
        ctx.stroke()

        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(top.x, center.y)
        ctx.lineTo(bottom.x, center.y)
        ctx.stroke()

        ctx.restore()
    }
}
