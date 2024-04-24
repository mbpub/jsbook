import MazeSolver from './mazeSolver.js'
const mazeSolver = new MazeSolver()

const errorElement = document.getElementById('error')

const sizeElement = { 
    rows: document.getElementById('rows'),
    cols: document.getElementById('cols')
}

const setSize = () => {
    const size = mazeSolver.getMazeSize()
    sizeElement.rows.value = size.rows
    sizeElement.cols.value = size.cols
}

setSize()

document.getElementById('apply')
    .addEventListener('click', (event) => {
    event.preventDefault()
    try {
        mazeSolver.initFromSize(
            parseInt(sizeElement.rows.value),
            parseInt(sizeElement.cols.value))
    } catch(e) {
        console.error(e)
        errorElement.innerText = e.toString()
    }
    setSize()
})

document.getElementById('save')
    .addEventListener('click', (event) => {
    event.preventDefault()
    const text = mazeSolver.toString()
    // window.showSaveFilePicker() needs https
    const a = document.createElement("a")
    a.href = window.URL.createObjectURL(
        new Blob([text],
        {type: 'text/plain'}))
    const size = mazeSolver.getMazeSize()
    a.download = `maze-${size[0]}x${size[1]}.txt`
    a.click()
})

document.getElementById('fileSelector')
    .addEventListener('change', (event) => {
    errorElement.innerText = ''
    const fileList = event.target.files
    if(fileList && fileList.length > 0) {
        const reader = new FileReader()
        
        reader.addEventListener('load', (event) => {
            const result = event.target.result
            try {
                if(!result) throw new Error('cannot read file')
                mazeSolver.initFromText(result)
                setSize()
            } catch(e) {
                console.error(e)
                errorElement.innerText = e.toString()
            }
        })

        reader.readAsText(fileList[0])
    }
})

document.querySelectorAll('input[name="searchType"]')
    .forEach(e => {
        e.addEventListener('change', (event) => {
            event.preventDefault()
            mazeSolver.useBfs = event.target.value === 'bfs'
        })
})

document.getElementById('solve')
    .addEventListener('click', (event) => {
    event.preventDefault()
    errorElement.innerText = ''
    try {
        mazeSolver.solve()
    } catch(e) {
        console.error(e)
        document.getElementById('error').innerText = e.toString()
    }
})

document.getElementById('clear')
    .addEventListener('click', (event) => {
    event.preventDefault()
    mazeSolver.cleanSolution()
    mazeSolver.render()
})

document.getElementById('maze')
    .addEventListener('click', (event) => {
    event.preventDefault()
    if(event.target.tagName.toUpperCase() === 'TD') {
        if(event.ctrlKey) {
            mazeSolver.toggleCell(
                parseInt(event.target.dataset.x),
                parseInt(event.target.dataset.y))
        } else {
            mazeSolver.flipCell(
                parseInt(event.target.dataset.x),
                parseInt(event.target.dataset.y))
        }
    }
})
