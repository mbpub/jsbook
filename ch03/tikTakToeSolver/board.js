import Mark from './mark.js'

export default class Board {
    #availableMoves
    #lastPlaceResult

    constructor(width = 3) {
        this.board = new Array(width).fill()
            .map(_ => new Array(width).fill(Mark.EMPTY))
        this.#lastPlaceResult = { ok: false, winner: Mark.EMPTY }
        this.#availableMoves = this.board.length * this.board.length
    }

    get width() {
        return this.board.length
    } 

    isSetAt(row, col) {
        return this.board[row][col] != Mark.EMPTY
    }

    setAt(row, col, mark) {
        const isSet = this.isSetAt(row, col)
        
        if(isSet && (mark === Mark.EMPTY)) {
            this.#availableMoves++
        }

        if(!isSet && (mark !== Mark.EMPTY)) {
            this.#availableMoves--
        }

        //console.log('#availableMoves', this.#availableMoves)
        this.board[row][col] = mark
    }

    getAt(row, col) {
        return this.board[row][col]
    }

    getTextAt(row, col) {
        return Mark.toSymbol(this.board[row][col])
    }

    get availableMoves() {
        return this.#availableMoves
    }

    get hasAvailableMoves() {
        return this.#availableMoves > 0
    }

    placeMark(row, col, mark) {
        this.#lastPlaceResult.ok = false
        if(!this.isGameDone && !this.isSetAt(row, col)) {
            this.setAt(row, col, mark)
            this.#lastPlaceResult.ok = true
            this.#lastPlaceResult.winner = this.checkWin(row, col)
        }

        return this.#lastPlaceResult.ok
    }

    get gameWinnerMark() {
        return this.#lastPlaceResult.winner
    }
    
    get isGameTie() {
       return this.gameWinnerMark === Mark.Tie 
    }

    get isGameDone() {
        return this.gameWinnerMark != Mark.EMPTY
    }

    checkWin(row, col, checkDiagonals = true) {
        let res = Mark.EMPTY
        const checkSum = (sum) => {
            if(sum === Mark.X * this.board.length) return Mark.X
            if(sum === Mark.O * this.board.length) return Mark.O
            return Mark.EMPTY
        }

        // row check
        res = checkSum(this.board[0]
            .reduce((sum, _, idx) => sum += this.board[row][idx], 0))
        if(res != Mark.EMPTY) return res

        // col check
        res = checkSum(this.board[0]
            .reduce((sum, _, idx) => sum+= this.board[idx][col], 0))
        if(res != Mark.EMPTY) return res

        if(checkDiagonals) {
            // diag 1 check
            res = checkSum(this.board[0]
                .reduce((sum, _, idx) => sum+= this.board[idx][idx], 0))
            if(res != Mark.EMPTY) return res

            // diag 2 check
            res = checkSum(this.board[0]
                .reduce((sum, _, idx) =>
                    sum+=
                    this.board[this.board.length - 1 - idx][idx], 0))
            if(res != Mark.EMPTY) return res
        }

        return this.hasAvailableMoves ? Mark.EMPTY : Mark.Tie
    }

    nextFree() {
        for(let row = 0; row < this.board.width; row++) {
            for(let col = 0; col < this.board.width; col++) {
                if(!this.isSetAt(row, col)) {
                    return { row, col }
                }
            }
        }

        return { row: -1, col: -1 }
    }

    toString() {
        return this.board
            .reduce((acc, row) =>
                acc += `\n${row
                    .map(_ => Mark.toSymbol(_)).join(', ')}`)
    }
}