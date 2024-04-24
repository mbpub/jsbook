import router from './code.js'

document.title = 'Tasks: Create'
router.addRouteChangedEventListener('/create', path => {
    document.title = 'Tasks: Create'
    console.log('route.change', path, document.title)
})

class TaskCreate {
    static async create(task) {
        const response = await fetch('/api/tasks/create', {
            method: 'POST',
            body: JSON.stringify(task)
            })
        console.log(await response.json())
        document.getElementById('title').value = ''
        document.getElementById('details').value = ''
        router.navigateTo('/tasks')
    }
}

document.getElementById('createForm').addEventListener('submit', event => {
    event.preventDefault()
    console.log(event)
    const title = document.getElementById('title').value
    const details = document.getElementById('details').value

    console.log('create', title, details)
    TaskCreate.create({_id: null, title, details})
        .catch(e => console.error(e))
})

