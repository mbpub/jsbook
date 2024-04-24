import GameModel from './model.js'

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

const model = new GameModel({
    width: canvas.width,
    height: canvas.height,
    objectRadius: 20})

window.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'ArrowDown':
            model.user.moveVertically(-1)
            break
        case 'ArrowUp':
            model.user.moveVertically(1)
            break
        case 'ArrowLeft':
            model.user.moveHorizontally(-1)
            break
        case 'ArrowRight':
            model.user.moveHorizontally(1)
            break                    
    }
    
    event.preventDefault()
})

function frame() {
    model.updateState()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    model.drawFrame(ctx)
    window.requestAnimationFrame(frame)
}

window.requestAnimationFrame(frame)