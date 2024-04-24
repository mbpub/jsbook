const workersPoolMax = 2 //window.navigator.hardwareConcurrency
const workers = []

for(let i = 0; i < workersPoolMax; i++) {
    const w = new Worker('worker.js', { type: 'module' })
    w.onmessage = function(event) {
        console.log('from worker', event.data)
        setData(event.data)
    }
    workers.push({w})
}

const scheduleNewTask = (payload, cmd = 'process') => {
    const idx = Math.floor(Math.random() * workersPoolMax);
    workers[idx].w.postMessage({cmd, payload, workerIdx: idx})
}

const setData = (data) => {
    document.getElementById('message').value = (data ?? {}).message ?? ''
}

const getData = (method) => {
    return { 
        message: document.getElementById('message').value,
        password: document.getElementById('password').value,
        method
    }
}

document.getElementById('encrypt')
    .addEventListener('click', event => {
        scheduleNewTask(getData(event.target.id))
})

document.getElementById('decrypt')
    .addEventListener('click', event => {
        scheduleNewTask(getData(event.target.id))
})
