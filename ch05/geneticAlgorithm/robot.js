import NeuralNetwork from '../../common/nn.js'
import * as utils from '../../common/utils.js'

export default class Robot {
    constructor(id, x = 0, y = 0) {
        this.id = id
        this.x = x; this.y = y
        this.visited = [ { x: this.x, y: this.y } ]
        this.nn = new NeuralNetwork([4, 10, 10, 4])
    }

    initVisited() {
        this.visited = [ { x: this.x, y: this.y } ]
    }

    distance() {
        const xMinMax = NeuralNetwork
            .minMax(this.visited.map(_ => _.x))
        const yMinMax = NeuralNetwork
            .minMax(this.visited.map(_ => _.y))
        const dx = xMinMax[1] - xMinMax[0]
        const dy = yMinMax[1] - yMinMax[0]
        return Math.sqrt(dx * dx + dy * dy)
    }
    
    clone() {
        const robot = new Robot(this.id, this.x, this.y)
        // reset visited
        robot.initVisited()
        robot.nn = this.nn.clone()
        return robot
    }

    moveNext(board) {
        const moves = [ 
            [this.x, this.y - 1],
            [this.x + 1, this.y],
            [this.x, this.y + 1],
            [this.x - 1, this.y] ]
        const moveCellType = moves
            .map(move => board.getCellType(move[0], move[1]))
        const x = moveCellType.map(_ => utils.norm(_, 0, 2))
        const y = this.nn.predict(x)
            .map(_ => NeuralNetwork.heavySide(_))

        const possibleMoves = []
        for(let i = 0; i < y.length; i++) {
            if(y[i] !== 1) {
                continue
            }
            
            const move = moves[i]
            const cellType = board.getCellType(move[0], move[1])
            if(cellType > 0) {
                continue
            }

            possibleMoves.push(move)
        }

        if(!possibleMoves.length) {
            return
        }

        let nextMove = null
        for(let i = 0; i < possibleMoves.length; i++) {
            const move = possibleMoves[i]
            if(!this.visited
                .some(_ => _.x === move[0] && _.y === move[1])) {
                nextMove = move
                break
            }
        }

        nextMove ??= possibleMoves[utils
            .uniformRndInt(0, possibleMoves.length)]
        this.x = nextMove[0]
        this.y = nextMove[1]
        this.visited.push({x: this.x, y: this.y})
    }
}
