import * as utils from '../../common/utils.js'
import Robot from './robot.js'
import Evolution from './evolution.js'

export default class Board {

    constructor(rows = 100, cols = 100) {
        this.rows = rows
        this.cols = cols
        this.blocked = []
        this.robots = []
        this.stepCount = 1
        this.generationCount = 1

        for(let i = 0;
            i < Math.floor((rows * cols) * 5 / 100); i++) {
            const x = utils.uniformRndInt(0, rows)
            const y = utils.uniformRndInt(0, cols)
            if(this.getCellType(x, y) > 0) {
                continue
            } 

            const robot =
                new Robot(this.robots.length.toString(), x, y)
            this.robots.push(robot)
        }

        for(let i = 0;
            i < Math.floor((rows * cols) * 10 / 100); i++) {
            const x = utils.uniformRndInt(0, rows)
            const y = utils.uniformRndInt(0, cols)
            if(this.getCellType(x, y) > 0) {
                continue
            }

            this.blocked.push({x, y})
        }
    }

    // 0 - free, 1 - blocked, 2 - robot
    getCellType(x, y) {
        // out or range

        if(x < 0 || x >= this.rows) {
            return 1
        }

        if(y < 0 || y >= this.cols) {
            return 1
        }

        if(this.blocked.some(_ => _.x === x && _.y === y)) {
            return 1
        }

        if(this.robots.some(_ => _.x === x && _.y === y)) {
            return 2
        }

        return 0
    }

    render(parentElement) {
        const index = new Map()
        const table = document.createElement('table')
        for(let i = 0; i < this.rows; i++) {
            const tr = document.createElement('tr')
            table.appendChild(tr)
            for(let j = 0; j < this.cols; j++) {
                const td = document.createElement('td')
                td.innerText = ' '
                td.style.backgroundColor = 'white'
                index.set(`${i}-${j}`, td)
                tr.appendChild(td)
            }
        }

        this.robots.forEach(cell => {
            const td = index.get(`${cell.x}-${cell.y}`)
            td.innerText = cell.id
            td.style.backgroundColor =
                (this.generationCount % 2 === 0)
                ? 'lightgreen'
                : 'skyblue'
        })

        this.blocked.forEach(cell => {
            const td = index.get(`${cell.x}-${cell.y}`)
            td.innerText = 'x'
            td.style.backgroundColor = 'lightpink'
        })

        parentElement.replaceChildren(table)
    }

    step() {
        this.robots.forEach(robot => robot.moveNext(this))
        return ++this.stepCount
    }

    geneticEvolution() {
        this.step()

        // every some steps
        if(this.stepCount % 50 === 0) {
            this.generationCount++
            this.robots = Evolution.nextGeneration(this.robots)
        }

        return { 
            stepCount: this.stepCount,
            generationCount: this.generationCount,
            robotsCount: this.robots.length
        }
    }
}
