import * as utils from '../../common/utils.js'
import Vector from './vector.js'

class MovingObject {
    
    constructor(position, color) {
        this.color = color
        this.position = position
        this.speed = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)
    }

    updateState(gameOptions) {
        this.#updatePosition()

        this.#fixBounds(
            gameOptions.objectRadius,
            gameOptions.objectRadius, 
            gameOptions.width - gameOptions.objectRadius,
            gameOptions.height - gameOptions.objectRadius)

        return this.position
    }

    #updatePosition() {
        this.#updateSpeed()
        this.position = this.position.add(this.speed)
    }

    #updateSpeed() {
        this.acceleration = this.acceleration
            .clampLength(0, 3)
            .toNearZero()
        this.speed = this.speed.add(this.acceleration)
        this.speed = this.speed.clampLength(0, 5).toNearZero()
    }

    #fixBounds(x0, y0, x1, y1) {
        if(this.position.x <= x0) {
            this.position = new Vector(x0, this.position.y)
            this.speed = new Vector(-this.speed.x, this.speed.y)
            this.acceleration = 
                new Vector(-this.acceleration.x, this.acceleration.y)
        }

        if(this.position.y <= y0) {
            this.position = new Vector(this.position.x, y0)
            this.speed = new Vector(this.speed.x, -this.speed.y)
            this.acceleration = 
                new Vector(this.acceleration.x, -this.acceleration.y)
        }

        if(this.position.x >= x1) {
            this.position = new Vector(x1, this.position.y)
            this.speed = new Vector(-this.speed.x, this.speed.y)
            this.acceleration =
                new Vector(-this.acceleration.x, this.acceleration.y)
        }

        if(this.position.y >= y1) {
            this.position = new Vector(this.position.x, y1)
            this.speed = new Vector(this.speed.x, -this.speed.y)
            this.acceleration =
                new Vector(this.acceleration.x, -this.acceleration.y)
        }
    }

    inverseDirection() {
        this.acceleration = this.acceleration.mul(-1)
        this.speed = this.speed.mul(-1)
        // hack to move objects a bit after collision
        Array(8).keys().forEach(_ => this.#updatePosition())
    }
}

class GhostBall extends MovingObject {
    constructor(position) {
        super(position, 'orange')
    }
}

class ControlledBall extends MovingObject {   
    constructor(position) {
        super(position, 'green')
    }

    moveVertically(direction) {
        this.acceleration = this.acceleration
            .add(new Vector(0, -10 * direction))
    }

    moveHorizontally(direction) {
        this.acceleration = this.acceleration
            .add(new Vector(0.5 * direction, 0))
    }
}

export default class GameModel {
    #hitCount

    constructor(gameOptions) {
        this.#hitCount = 0
        this.gameOptions = gameOptions
        const position = new Vector(
            gameOptions.width / 2,
            gameOptions.height / 2)
        this.user = new ControlledBall(position)
        this.user.acceleration = new Vector(0, -0.1)
        this.objects = new Array(2).fill().map(_ => {
            const position = Vector.fromRandom(
                gameOptions.objectRadius,
                gameOptions.width,
                gameOptions.objectRadius,
                gameOptions.height)
            const acceleration = Vector.fromRandom(-2, 2, -2, 2)
            const gd = new GhostBall(position)
            gd.acceleration = acceleration
            return gd
        })
    }

    #collides(object1, object2) {
        // this is same
        //distance = object1.position.sub(object2.position).length
        const distance = utils.distance(
            object1.position.x, 
            object1.position.y,
            object2.position.x, 
            object2.position.y)
        return distance <= 2 * this.gameOptions.objectRadius
    }

    updateState() {
        this.user.updateState(this.gameOptions)
        if(this.user.color === 'red') {
            this.user.color = 'green'
        }

        this.objects.forEach(object => {
            if(!object) return

            if(object.color === 'red') {
                object.color = 'orange'
            }

            if(this.#collides(this.user, object)) {
                this.#hitCount++
                object.inverseDirection()
                this.user.inverseDirection()
                object.color = 'red'
                this.user.color = 'red'
            }
            object.updateState(this.gameOptions)
        })
    }

    drawFrame(ctx) {

        ctx.fillStyle = 'blue'
        ctx.font = '10px serif'
        ctx.fillText(`Hits: ${this.#hitCount}`, 0, 10)

        this.drawObject(ctx, this.user, true)
        this.objects.forEach(_ => this.drawObject(ctx, _))
    }

    drawObject(ctx, object, isUser) {
        if(!object) return
        ctx.save()
        ctx.translate(object.position.x, object.position.y)

        const drawCircle = (radius) => {
            ctx.beginPath()
            ctx.arc(
                    0,
                    0,
                    radius,
                    0,
                    2 * Math.PI,
                    false)
                
            ctx.fillStyle = object.color
            ctx.fill()
            ctx.stroke()
        }

        const drawLine = (x0, y0, x1, y1) => {
            ctx.fillStyle = 'black'
            ctx.beginPath()
            ctx.moveTo(x0, y0)
            ctx.lineTo(x1, y1)
            ctx.stroke()
        }

        drawCircle(this.gameOptions.objectRadius)
        if(isUser) {
            drawCircle(this.gameOptions.objectRadius - 4)
        }

        const speed = object.speed
            .rangeLength(5, this.gameOptions.objectRadius - 8)
        drawLine(0, 0, speed.x, speed.y)

        // draw arrow
        const a1 = speed.addAngleDegrees(30).mul(0.6)
        const a2 = speed.addAngleDegrees(-30).mul(0.6)
        drawLine(a1.x, a1.y, speed.x, speed.y)
        drawLine(a2.x, a2.y, speed.x, speed.y)

        ctx.restore()
    }
}
