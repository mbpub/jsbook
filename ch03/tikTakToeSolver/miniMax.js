import Mark from './mark.js'

// based on:
// https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/
// https://github.com/DavidHurst/MiniMax-TicTacToe-Java/tree/master

export default class MiniMax {

    static #iterateBoard(board, playerMark, workerCb) {
        const width = board.width
        for(let row = 0; row < width; row++) {
            for(let col = 0; col < width; col++) {
                if(board.isSetAt(row, col)) {
                    continue
                }

                board.setAt(row, col, playerMark)
                const stop = workerCb(row, col)
                // backtrack
                board.setAt(row, col, Mark.EMPTY)
                if(stop) {
                    return
                }
            }
        }
    }

    static bestMove(board, winningPlayerMark = Mark.X) {
        const width = board.width

        let maxDepth = 16 - 2 * width
        if(maxDepth < 3) maxDepth = 3
        console.log('width', width, 'maxDepth', maxDepth)

        let bestValue = Number.MIN_SAFE_INTEGER
        let bestMove = { row: -1, col: -1 }
        const callCount = { count: 0 }
        MiniMax.#iterateBoard(board, winningPlayerMark, (row, col) => {
            const value = MiniMax.miniMax(
                board,
                winningPlayerMark,
                maxDepth,
                Number.MIN_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                false,
                callCount)
            
            // optimize
            if(value > bestValue) {
                bestMove.row = row
                bestMove.col = col
                bestValue = value
            }
        })

        console.log('minMax.callCount', callCount.count,
            'availableMoves', board.availableMoves)
        return bestMove
    }
    
    static miniMax(board, winningPlayerMark, depth,
        alpha, beta, isMax, callCount = {}) {
        callCount.count++

        const boardValue =
            MiniMax.#evaluateBoard(board, depth, winningPlayerMark)
        // terminal state
        if((Math.abs(boardValue) > 0)
            || (depth <= 0)
            || !board.hasAvailableMoves) {
            return boardValue
        }

        const maxMark = winningPlayerMark
        const minMark = Mark.other(winningPlayerMark)

        if(isMax) {
            let hiVal = Number.MIN_SAFE_INTEGER

            MiniMax.#iterateBoard(board, maxMark, () => {
                hiVal = Math.max(hiVal, MiniMax.miniMax(
                    board,
                    maxMark,
                    depth - 1,
                    alpha,
                    beta,
                    false,
                    callCount))
                // optimize
                alpha = Math.max(alpha, hiVal)
                if(alpha >= beta) {
                    return true
                }
            })

            return hiVal
        } else {
            let loVal = Number.MAX_SAFE_INTEGER

            MiniMax.#iterateBoard(board, minMark, () => {
                loVal = Math.min(loVal, MiniMax.miniMax(
                        board,
                        maxMark,
                        depth - 1,
                        alpha,
                        beta,
                        true,
                        callCount))
                // optimize
                beta = Math.min(beta, loVal)
                if(beta <= alpha) {
                    return true
                }
            })

            return loVal
        }
    }
    
    static #evaluateBoard(board, depth, winningPlayerMark = Mark.X) {
        // +10 for win of winningPlayerMark, weight by depth
        // -10 for win of !winningPlayerMark, weight by depth
        // 0 otherwise
        const bonus = 10 + depth

        // check rows and cols
        for(let i = 0; i < board.width; i++) {
            // check row i and col i; and for i = 0 check diagonals
            const res = board.checkWin(i, i, i === 0)
            if(res === winningPlayerMark) {
                return bonus
            } else if (res === Mark.other(winningPlayerMark)) {
                return -bonus
            }
        }

        return 0
    }
}