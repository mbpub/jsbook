import HttpResponse from './httpResponse.js'
import dataStorage from './data/storage.js'

export default class Api {

    #handlers

    constructor() {
        this.#handlers = new Map()
        this.#init()
    }

    async get(urlPath, data) {
        return await this.#invokeHandler(urlPath, data, false)
    }

    async post(urlPath, data) {
        return await this.#invokeHandler(urlPath, data, true)
    }

    async #invokeHandler(urlPath, data, isPost = false) {
        const id = this.#getHandlerId(urlPath, isPost)
        console.log('API:', id, data)
        const handler = this.#handlers.get(id)
        if(!handler) {
            console.log('API:', id, '404')
            return HttpResponse.from404()
        }

        const result = await handler(urlPath, data)
        return new HttpResponse(JSON.stringify(result, null, 2))
    }

    #getHandlerId(urlPath, isPost = false) {
        return `${(isPost ? 'POST' : 'GET')} ${urlPath}`
    }

    #init() {
        this.#handlers.set(this.#getHandlerId('/api/tasks'),
            async (urlPath, req) => {
            const storage = await dataStorage()
            const res = await storage.list(req)
            return res
        })

        this.#handlers.set(this.#getHandlerId('/api/tasks/create', true),
            async (urlPath, req) => {
            const storage = await dataStorage()
            const _id = await storage.create(req)
            return { _id }
        })

        this.#handlers.set(this.#getHandlerId('/api/tasks/update', true),
            async (urlPath, req) => {
            const storage = await dataStorage()
            const _id = await storage.update(req)
            return { _id }
        })

        this.#handlers.set(this.#getHandlerId('/api/tasks/delete', true),
            async (urlPath, req) => {
            const storage = await dataStorage()
            const deleted = await storage.delete(req._id)
            return { deleted }
        })
    }
}