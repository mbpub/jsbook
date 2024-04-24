import * as fs from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import Task from './task.js'
import * as WeakOrdering from './toposort.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Storage {

    #filePath
    #data
    #loaded

    constructor() {
        this.#data = new Map()
        this.#filePath = path.join(__dirname, '__data__.json')
        this.#loaded = false
    }

    async create(item) {
        item._id = crypto.randomUUID()
        this.#data.set(item._id, item)
        await this.#save()
        return item._id
    }

    async update(item) {
        if(!item._id) throw new Error('invalid _id')
        this.#data.set(item._id, item)
        await this.#save()
        return item._id
    }

    async delete(itemId) {
        const deleted = this.#data.delete(itemId)
        await this.#save()
        return deleted
    }

    async list(filter) {
        filter ??= {}
        if(filter._id) {
            return [ this.#data.get(filter._id) ]
        }

        let data = [...this.#data.values()]
        if(filter.reportFrontiers === '1') {

            const temp = data.map(_ =>
                new WeakOrdering.OrderedNode(_._id, _.before, _.after, _))
            const weakSorted = WeakOrdering.TopologicalSort
                .sort(temp, true)
            data = weakSorted.map(_ => {
                // clone
                const task = Task.fromObject(
                    JSON.parse(JSON.stringify(_.value)))
                task.frontier = _.frontier
                return task
            })
        } else {
            data.sort((a, b) => (a.title ?? '')
            .localeCompare(b.title ?? ''))
        }

        let i = filter.skip ? parseInt(filter.skip) : 0
        const max = filter.take
            ? Math.min(
                    parseInt(filter.take) + (filter.skip > 0 ? 1 : 0),
                    data.length)
            : data.length

        return data.slice(i, max)
    }

    async #save() {
        const data = JSON.stringify(
                Object.fromEntries(this.#data), null, 2)
        await fs.writeFile(this.#filePath, data)
    }

    async load() {
        if(this.#loaded) return
        this.#loaded = true

        try {
            await fs.access(this.#filePath)
        } catch (e) {
            this.#data = new Map()
            return
        }

        const data = await fs.readFile(this.#filePath)
        const json = JSON.parse(data.toString())
        this.#data = new Map(Object.entries(json)
            .map(e => [e[0], Task.fromObject(e[1])]))
    }
}

// singleton
const storage = new Storage()

const dataStorage = async () => {
    await storage.load()
    return storage
}

export default dataStorage
