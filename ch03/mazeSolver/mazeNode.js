import * as DfsBfs from '../../common/dfsBfs.js'
import MazeCell from './mazeCell.js'

export default class MazeNode extends DfsBfs.Node {

    constructor(maze, i, j) {
        super(`${i},${j}`, { maze, i, j }, {})
    }

    get neighbors() {
        const res = []
        const x = this.value.i
        const y = this.value.j

        const addNode = (i, j) => {
            if((i < 0)
                || (j < 0) 
                || (i >= this.value.maze.length) 
                || (j >= this.value.maze[i].length)) return

            if(MazeCell.isValidChild(this.value.maze[i][j])) {
                    res.push(new MazeNode(this.value.maze, i, j))
            }
        }

        [
            [x - 1, y], [x, y - 1],
            [x + 1, y], [x, y + 1]
        ].forEach(n => addNode(n[0], n[1]))
      
        return res
    }
}
