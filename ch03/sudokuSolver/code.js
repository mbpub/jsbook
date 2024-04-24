import Sudoku from './sudoku.js'

new class Game {
    constructor() {
        this.board = document.getElementById('board')
        this.sudoku = new Sudoku()
        this.generate()

        // this within event is DOM element, we bind to this
        board.addEventListener('keyup', this.input.bind(this))
        document.getElementById('generate')
            .addEventListener('click', this.generate.bind(this))
        document.getElementById('solve')
            .addEventListener('click', this.solve.bind(this))
        document.getElementById('test')
            .addEventListener('click', this.test.bind(this))
    }

    #msg(message) {
        document.getElementById('message').innerText = message ?? ''
    }

    #render() {
        this.sudoku.render(this.board)
    }

    generate() {
        this.#msg()
        const toSolvePercent = parseInt(document
                .getElementById('level').value) / 100
        this.sudoku.generate(toSolvePercent)
        this.#render()
    }

    solve() {
        this.#msg()
        const solved = this.sudoku.trySolve()
        this.#msg(`${(solved ? 'Solved!' : 'No solution!')}`)
        this.#render()
    }

    test() {
        this.#msg()
        const errors = this.sudoku.test()
        
        let text = `Test: ${(errors.hasErrors ? 'failed' : 'passed')}`
        if(errors.hasErrors) {
            text += `\n${errors.toString()}`
        }

        this.#msg(text)
    }

    input(event) {
        if (!event.target || (event.target.nodeName !== 'TD')) {
            return
        }
        
        this.#msg()
        const td = event.target
        td.innerText = this.sudoku.setCellFromText(
            td.innerText.trim(),
            parseInt(td.dataset.x),
            parseInt(td.dataset.y)
        )

        const errors = this.sudoku.test()
        if(!errors.hasErrors)
        {
            this.#msg('Solved!')
        }

        console.log('current', JSON.stringify(this.sudoku.board))
    }
}
