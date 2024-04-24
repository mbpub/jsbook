import * as utils from '../../common/utils.js'

export default class Sudoku {
    static #free = -1
    
    constructor() {
        this.#init()
    }

    #init() {
        // 9x9
        this.board = this.board = new Array(9).fill()
            .map(_ => new Array(9).fill(Sudoku.#free))
        this.solveCount = 0
    }

    generate(toSolvePercent = 0.5) {
        this.#init()
        console.log('init', JSON.stringify(this.board))
        
        // solve empty one
        this.solve()
        console.log(`solve#${this.solveCount}`,
            JSON.stringify(this.board))
        
        // remove 50% random by default
        const randomizePercent = (9 * 9) * toSolvePercent
        for(let i = 0; i < randomizePercent; i++) {
            const r = utils.uniformRndInt(0, 9)
            const c = utils.uniformRndInt(0, 9)
            this.board[r][c] = Sudoku.#free
        }

        console.log('generate', toSolvePercent, JSON.stringify(this.board))
    }
    
    solve() {
        this.solveCount = 0
        return this.#solve(0, 0)
    }

    #solve(row, col) {
        this.solveCount++
        // col is reset to 0 after first i loop
        for(let i = row; i < 9; i++, col = 0) {
            for(let j = col; j < 9; j++) {
                
                if(this.board[i][j] !== Sudoku.#free) {
                    continue
                }

                // numbers 1-9 randomly ordered
                const values = Array(9).fill().map((_, i) => i + 1)
                utils.shuffle(values)

                for(let k = 0; k < 9; k++) {
                    const v = values[k]

                    if(this.#isValid(i, j, v)) {
                        this.board[i][j] = v

                        // brute-force next one
                        if(this.#solve(i, j + 1)) {
                            return true
                        }

                        // backtrack
                        this.board[i][j] = Sudoku.#free
                    }
                }

                return false
            }
        }

        return true
    }

    #isValid(row, col, value) {
        const subRow = (Math.floor(row / 3)) * 3
        const subCol = (Math.floor(col / 3)) * 3
        const isValue = (x, y) => this.board[x][y] === value

        for(let i = 0; i < 9; i++) {
            const ii = subRow + Math.floor(i / 3)
            const jj = subCol + Math.floor(i % 3)
            // console.log('ii', ii, 'jj', jj)
            if(isValue(i, col)
                || isValue(row, i)
                || isValue(ii, jj)) {
                return false
            }
        }

        return true
    }

    render(container) {
        // 9 tr-s with 9 td-s each
        const table = document.createElement('table')

        // define cells groups 3x3 for CSS border
        for(let i = 0; i < 3; i++) {
            const cg = document.createElement('colgroup')
            table.appendChild(cg)
            for(let j = 0; j < 3; j++) {
                cg.appendChild(document.createElement('col'))
            }
        }
        
        let tbody = null
        for(let i = 0; i < 9; i++) {
            // define tbody every 3 rows
            if(i % 3 === 0) {
                tbody = document.createElement('tbody')
                table.appendChild(tbody)
            }

            const tr = document.createElement('tr')
            tbody.appendChild(tr)
            for(let j = 0; j < 9; j++) {
                const td = document.createElement('td')
                tr.appendChild(td)
                td.dataset.x = i, td.dataset.y = j
                td.setAttribute('contenteditable', 'true')
                td.innerText = this.#getCellText(i, j)
                if(this.board[i][j] === Sudoku.#free) {
                    td.classList.add('empty')
                }
            }
        }

        container.replaceChildren(table)
    }

    #getCellText(i, j) {
        return this.board[i][j] === Sudoku.#free
            ? ''
            : this.board[i][j].toString() 
    }

    setCellFromText(valueText, i, j) {
        if(valueText === '') {
            this.board[i][j] = Sudoku.#free
        } else {
            const value = parseInt(valueText)
            if(!isNaN(value) && (value >=1) && (value <= 9)) {
                this.board[i][j] = value
            }
        }

        return this.#getCellText(i, j)
    }

    test() {
        const rowChecks = new Array(9).fill().map(_ => new Set())
        const colChecks = new Array(9).fill().map(_ => new Set())
        const subChecks = new Array(9).fill().map(_ => new Set())
        const checkSet = set => (set.size === 9)
            && (set.keys().reduce((sum, v) => sum+=v, 0) === 9 * 5)
        
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                rowChecks[i].add(this.board[i][j])
                colChecks[j].add(this.board[i][j])

                // 0-8 sub-table
                const sub = Math.floor(i / 3) * 3 + Math.floor(j / 3)
                // console.log(i, j, 'sub', sub)
                subChecks[sub].add(this.board[i][j])
            }
        }

        const errors = {
            hasErrors: false,
            rows: [],
            cols: [],
            subs: [],

            toString: function() {
                return `subs: ${this.subs.join(', ')}
                    rows: ${this.rows.join(', ')}
                    cols: ${this.cols.join(', ')}`
            }
        }

        for(let i = 0; i < 9; i++) {
            if(!checkSet(rowChecks[i])) errors.rows.push(i + 1)
            if(!checkSet(colChecks[i])) errors.cols.push(i + 1)
            if(!checkSet(subChecks[i])) errors.subs.push(i + 1)
        }

        errors.rows.sort()
        errors.cols.sort()
        errors.subs.sort()
        errors.hasErrors = !!errors.rows.length

        return errors
    }

    trySolve() {
        const clone = JSON.parse(JSON.stringify(this.board))
        this.solve()
        const errors = this.test()
        const solved = !errors.hasErrors
        if(!solved) {
            this.board = clone
        }

        return solved
    }
}
