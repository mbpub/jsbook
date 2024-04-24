import Board from './board.js'

const boardElement = document.getElementById('board')
const stepsElement = document.getElementById('steps')

const board = new Board(20, 20)
board.render(boardElement)

setInterval(() => {
    const counts = board.geneticEvolution()
    board.render(boardElement)
    stepsElement.innerText = `Steps: ${counts.stepCount},
        Generation: ${counts.generationCount},
        Robots: ${counts.robotsCount}`.replace(/\n/g, ' ')
}, 100)
