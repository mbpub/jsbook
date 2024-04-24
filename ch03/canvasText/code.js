import * as utils from '../../common/utils.js'

// setup
const canvas = document.getElementById('canvas1')
canvas.width = window.screen.availWidth
canvas.height = window.screen.availHeight
const ctx = canvas.getContext('2d')

let startTime = performance.now()
let currentPoint = { x: 50, y: window.screen.availHeight / 2 }
let startPoint = currentPoint
let targetPoint = currentPoint

canvas.addEventListener('mousemove', event => {
    startPoint = currentPoint
    targetPoint = { x: event.clientX, y: event.clientY }
    startTime = performance.now()
})

// animation
const durationMls = 1000
const frame = () => {
    // (performance.now() - startTime) / durationMls
    let timePercent = utils.norm(
        performance.now(), startTime, startTime + durationMls)
    if(timePercent > 1.0) timePercent = 1.0
    draw(timePercent)
    window.requestAnimationFrame(frame)
}

// start animation
window.requestAnimationFrame(frame)

// draw one frame
const draw = (timePercent) => {
    // clean previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCoordinates()

    // draw text
    // currentPoint = {
    //     x: utils.lerp(timePercent, startPoint.x, targetPoint.x),
    //     y: utils.lerp(timePercent, startPoint.y, targetPoint.y),
    // }

    const easeLinear = (t) => utils.lerp(t, 0, 1)

    currentPoint = {
        x: ease(timePercent, startPoint.x, targetPoint.x,
            easeLinear),
        y: ease(timePercent, startPoint.y, targetPoint.y,
            easeInExpo)
    }

    ctx.fillStyle = 'blue'
    ctx.font = '40px serif'
    ctx.fillText('Hello', currentPoint.x, currentPoint.y)
}

const drawCoordinates = () => {
    ctx.font = '10px serif'
    ctx.lineWidth = 0.1* window.devicePixelRatio

    const drawLine = (x0, y0, x1, y1) => {
        ctx.fillStyle = 'gray'
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
    }
    
    ctx.fillText(`0,0`, 4, 10)

    for(let x = 100; x <= window.screen.availWidth; x += 100) {
        drawLine(x, 0, x, window.screen.availHeight)
        ctx.fillStyle = 'black'
        ctx.fillText(`x=${x}`, x + 4, 10)
    }

    for(let y = 100; y <= window.screen.availHeight; y += 100) {
        drawLine(0, y, window.screen.availWidth, y)
        ctx.fillStyle = 'black'
        ctx.fillText(`y=${y}`, 4, y + 10)
    }
}

const easeLinear = (t) => utils.lerp(t, 0, 1)
const easeInQuart = (t) => t * t * t * t
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)
const easeInExpo = (t) =>
    (t <= 0) ? 0 : Math.pow(2, 10 * t - 10)
const easeOutExpo = (t) =>
    (t === 1) ? 1 : 1 - Math.pow(2, -10 * t)

const ease = (timePercent, minX, maxX,
        easeFn = easeInQuart, easeMin = 0, easeMax = 1) => {
    let temp = easeFn(timePercent)
    return utils.range(temp, easeMin, easeMax, minX, maxX)
}
