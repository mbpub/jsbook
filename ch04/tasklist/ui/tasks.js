import router from './code.js'

document.title = 'Tasks'
router.addRouteChangedEventListener('/tasks', path => {
    document.title = 'Tasks'
    console.log('route.change', path, document.title)
    if(main.isConnected) {
        tasks.loadTasks().catch(e => console.error(e))
    }
})

const main = document.getElementById('main')

class TaskList {

    constructor() {
    }

    async loadTasks() {
        const response = await fetch('/api/tasks')
        const data = await response.json()
        console.log('loadTasks', data)

        const taskCards = []
        data.forEach(task => {
            taskCards.push(this.#getTaskCard(task))
        })

        main.replaceChildren(...taskCards)
    }

    #getTaskCard(task) {
        const template = document.getElementById('taskCard')
        const instance = template.content.cloneNode(true)
        instance.getElementById('title').innerText = task.title
        instance.getElementById('details').innerText = task.details
        instance.getElementById('edit').dataset.task = task._id
        instance.getElementById('delete').dataset.task = task._id
        return instance
    }

    async edit(taskId, element) {
        const card = document.querySelector(`#${taskId}`)
        console.log('edit', taskId, 'TODO', card)
    }

    async delete(taskId, element) {
        console.log('delete', taskId)
        const response = await fetch('/api/tasks/delete', {
            method: 'POST',
            body: JSON.stringify({_id: taskId})
            })
        await this.loadTasks()
    }
}

const tasks = new TaskList()

main.addEventListener('click', event => {
    switch(event.target.id) {
        case 'edit':
            tasks
                .edit(event.target.dataset.task, event.target)
                .catch(e => console.error(e))
            break
        case 'delete':
            tasks
                .delete(event.target.dataset.task, event.target)
                .catch(e => console.error(e))
            break
    }
})

tasks.loadTasks().catch(e => console.error(e))
