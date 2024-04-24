import * as DfsBfs from '../../common/dfsBfs.js'
import * as utils from '../../common/utils.js'
import MazeCell from './mazeCell.js'
import MazeNode from './mazeNode.js'

export default class MazeSolver {
    #useBfs

    constructor() {
        this.mazeElement = document.getElementById('maze')
        const lastMaze = this.#loadState()
        if(lastMaze) {
            this.initFromText(lastMaze)
        } else {
            this.initFromSize(8, 10)
        }
    }

    #clearState() {
        this.maze = new Array(2)
            .fill()
            .map(_ => new Array(2).fill(MazeCell.Open))
        this.cleanSolution()
    }

    cleanSolution() {
        this.solutionPath = null
    }

    initFromText(mazeStr) {
        this.#clearState()
        this.#initFromString(mazeStr)

        try {
            this.solve()
        } catch {}

        this.render()
    }

    #initFromString(mazeStr) {
        if(!mazeStr) throw new Error('maze not defined')
        const mazeRows = mazeStr.trim()
            .split('\n')
            .map(row => row.endsWith('\r')
                ? row.substring(0, row.length - 1)
                : row)
            .filter(row => !!row)
        if(mazeRows.length < 2) throw new Error('maze needs >=2 rows')
        this.maze = new Array(mazeRows.length).fill()
        mazeRows.forEach((row, i) => {
            if(!row) return
            this.maze[i] = new Array()
            row = row.trim()
            for(let j = 0; j < row.length; j++) {
                this.maze[i][j] = row[j]
            }
        })
    }

    initFromSize(rows, cols) {
        rows = utils.clamp(Number.isNaN(rows) ? 0 : rows, 2, 64)
        cols = utils.clamp(Number.isNaN(cols) ? 0 : cols, 2, 64)
        this.#clearState()
        this.maze = new Array(rows)
            .fill()
            .map(_ => new Array(cols).fill(MazeCell.Open))
        // can be made also random
        this.maze[0][0] = MazeCell.Start
        this.maze[rows - 1][cols - 1] = MazeCell.Goal

        const rndMax = Math.floor(rows * cols * 0.27)
        for(let i = 0; i < rndMax; i++) {
            const x = utils.uniformRndInt(0, rows)
            const y = utils.uniformRndInt(0, cols)
            if(!MazeCell.isStartOrGoal(this.maze[x][y])) {
                this.maze[x][y] = MazeCell.Blocked
            }
        }

        try {
            this.solve()
        } catch {}

        this.render()
    }

    render() {
        const table = document.createElement('table')
        this.maze.forEach((row, i) => {
            const tr = document.createElement('tr')
            table.appendChild(tr)
            row.forEach((col, j) => {
                const td = document.createElement('td')
                td.dataset.x = i
                td.dataset.y = j
                const ui = MazeCell.getTextAndColor(this.maze[i][j])
                td.innerText = ui.text
                td.style.backgroundColor = ui.color

                if(this.solutionPath) {
                    const solutionIdx = this.solutionPath
                        .findIndex(_ => (_[0] === i) && (_[1] === j))
                    if(solutionIdx >= 0) {
                        if(!MazeCell.isStartOrGoal(this.maze[i][j])) {
                            td.style.backgroundColor = 'orange'
                        }

                        td.innerText =
                            `${td.innerText.trim()}:${solutionIdx.toString()}`
                    }
                }

                tr.appendChild(td) 
            })
        })

        this.mazeElement.replaceChildren(table)
        this.#saveState()
    }

    solve() {
        if(!this.maze || !this.maze.length) {
            throw new Error('no maze')
        }

        this.cleanSolution()
        let solutionPath = null

        const visitor = {
            stop: false,
        
            enterNode: function(node, pathStack) {
                const current = node.value.maze[node.value.i][node.value.j]
                if(current === MazeCell.Goal) {
                    this.stop = true
                    solutionPath = pathStack()
                    return true
                }
            },
        
            shouldStop: function() {
                return this.stop
            }
        }

        if(this.#useBfs) {
            DfsBfs.Search.bfs(this.#rootNode, visitor, true)
        } else {
            DfsBfs.Search.dfs(this.#rootNode, visitor, true)
        }
        
        if(!solutionPath) {
            console.error('cannot solve')
            throw new Error('cannot solve')
        }

        this.solutionPath = solutionPath.map(_ =>[_.value.i, _.value.j])
        this.render()
    }

    #findFirstIndex(value) {
        for(let i = 0; i < this.maze.length; i++) {
            const foundIdx = this.maze[i].findIndex(_ => _ === value)
            if(foundIdx >= 0) {
                return [i, foundIdx]
            }
        }

        return null
    }

    get #rootNode() {
        const start = this.#findFirstIndex(MazeCell.Start)
        if(!start) throw new Error(`No start: ${MazeCell.Start}`)
        return new MazeNode(this.maze, start[0], start[1])
    }

    get useBfs () {
        return this.#useBfs
    }

    set useBfs (value) {
        this.cleanSolution()
        this.#useBfs = value
        this.render()
    }

    toggleCell(i, j) {
        this.cleanSolution()
        switch(this.maze[i][j]) {
            case MazeCell.Blocked: this.maze[i][j] = MazeCell.Open; break
            case MazeCell.Open: this.maze[i][j] = MazeCell.Blocked; break
            case MazeCell.Start: this.maze[i][j] = MazeCell.Goal; break
            case MazeCell.Goal: this.maze[i][j] = MazeCell.Start; break
        }

        this.render()
    }

    flipCell(i, j) {
        this.cleanSolution()
        switch(this.maze[i][j]) {
            case MazeCell.Blocked: this.maze[i][j] = MazeCell.Open; break
            case MazeCell.Open: this.maze[i][j] = MazeCell.Start; break
            case MazeCell.Start: this.maze[i][j] = MazeCell.Goal; break
            case MazeCell.Goal: this.maze[i][j] = MazeCell.Blocked; break
        }

        this.render()
    }

    getMazeSize() {
        return { rows: this.maze.length, cols: this.maze[0].length }
    }

    #loadState() {
        return window.localStorage.getItem('maze')
    }

    #saveState() {
        window.localStorage.setItem('maze', this.toString())
    }

    toString() {
        if(!this.maze) return ''
        return this.maze.reduce((acc, row) => acc += row.join('') + `\n`, '')
    }
}
