import Mark from './mark.js'
import Board from './board.js'
import MiniMax from './miniMax.js'

new class Game {
    constructor() {
        this.message = document.getElementById('message')
        this.boardSize = document.getElementById('boardSize')
        this.container = document.getElementById('board')
        this.container.addEventListener('click', this.#input.bind(this))
        document.getElementById('restart').addEventListener('click', this.#init.bind(this))
        const saveBoardSize = localStorage.getItem('boardSize')
        this.boardSize.value = saveBoardSize ? parseInt(saveBoardSize) : '3'
        this.thinking = false
        this.#init()
    }

    #init() {
        this.start(parseInt(this.boardSize.value))
        localStorage.setItem('boardSize', this.board.width)
    }

    #input(event) {
        if(this.thinking || this.board.isGameDone) {
            return
        }

        if (!event.target || (event.target.nodeName !== 'TD')) {
            return
        }

        const td = event.target
        const row = parseInt(td.dataset.row)
        const col = parseInt(td.dataset.col)
        this.#userMove(row, col)
    }

    start(boardSize = 3, aiMark = Mark.X) {
        this.container.style.cursor = 'pointer'
        this.#msg()
        this.aiMark = aiMark
        this.board = new Board(boardSize, this.aiMark)
        // ai first
        const nextIdx = () => Math.floor(
                Math.random() * this.board.width)
        this.board.placeMark(nextIdx(), nextIdx(), this.aiMark)
        this.#checkGameDone()
    }

    #msg(message) {
        this.message.innerHTML = message ??= 'TicTakToe'
    }

    #render() {
        const table = document.createElement('table')
        for(let row = 0; row < this.board.width; row++) {
            const tr = document.createElement('tr')
            table.appendChild(tr)
            for(let col = 0; col < this.board.width; col++) {
                const td = document.createElement('td')
                tr.appendChild(td)
                
                if(this.board.getAt(row, col) === Mark.X) {
                    td.classList.add("markX")
                }

                if(this.board.getAt(row, col) === Mark.O) {
                    td.classList.add("markO")
                }

                td.dataset.row = row, td.dataset.col = col
                td.innerText = this.board.getTextAt(row, col)
            }
        }

        this.container.replaceChildren(table)
    }

    #checkGameDone() {
        this.#msg()
        if(!this.board.isGameDone) {
            this.#render()
            return
        }

        this.container.style.cursor = 'not-allowed'
        if(this.board.isGameTie) {
            this.#msg('Done: Tie!')
        } else {
            const textClass = `mark${
                Mark.toSymbol(this.board.gameWinnerMark)}`
            this.#msg(`<strong>Winner: <span class="${textClass}">${
                Mark.toWinnerText(
                    this.board.gameWinnerMark)}</span>!</strong>`)
        }

        this.#render()
    }

    #userMove(row, col) {

        // user
        if(!this.board.placeMark(row, col, Mark.other(this.aiMark))) {
            return
        }

        this.#checkGameDone()
        if(this.board.isGameDone) {
            return
        }

        // ai
        this.#msg('thinking ...')
        setTimeout(() => {
            this.thinking = true
            try{
                let bestMove = MiniMax.bestMove(this.board, this.aiMark)
                this.#msg()
                if(!bestMove || (bestMove.row < 0) || (bestMove.col < 0)) {
                    // this should not happen
                    console.log('ai: using board.nextFree')
                    bestMove = this.board.nextFree()
                }

                this.board.placeMark(bestMove.row, bestMove.col, this.aiMark)
                this.#checkGameDone()
            }
            catch(e) {
                console.error(e)
            } finally {
                this.thinking = false
            }
        }, 0)
    }
}