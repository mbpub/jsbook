export default class HashRouter {

    #eventListeners = {}

    constructor(appElementId = null, routesJsonPath = null) {
        this.cache = new Map()
        this.init(appElementId, routesJsonPath)
            .catch(e => console.error(e))
    }

    async init(appElementId = null, routesJsonPath = null) {
        this.appElement = document.getElementById(appElementId ?? 'app')
        await this.#loadRoutes(routesJsonPath)

        this.baseUrl = window.location.href
        if(window.location.hash) {
            this.baseUrl = this.baseUrl
                .substring(0, this.baseUrl.length - window.location.hash.length)
        }
        if(!this.baseUrl.endsWith('/')) {
            const idx = this.baseUrl.lastIndexOf('/')
            this.baseUrl = this.baseUrl.substring(0, idx + 1)
        }

        if(this.baseUrl.startsWith(window.location.origin)) {
            this.baseUrl = this.baseUrl
                .substring(window.location.origin.length)
        }

        // baseUrl /code/ch03/router/
        console.log('baseUrl', this.baseUrl)

        window.addEventListener('hashchange', (event) => {
            this.load().catch(e => console.error(e))
        })

        await this.load()
    }

    async #loadRoutes(relativePath = null) {
        const response = await fetch(relativePath ?? 'routes.json')
        this.routes = await response.json()
    }
    
    async load() {
        let hash = window.location.hash || '/'
        if(hash.startsWith('#')) hash = hash.substring(1)
        const queryIdx = hash.indexOf('?')
        if(queryIdx >= 0) {
            hash = hash.substring(0, queryIdx)
        }

        console.log('load.hash', hash)
        if(this.cache.has(hash)) {
            console.log('load.cached', hash)
            this.appElement.replaceChildren(...this.cache.get(hash))
            this.#onRouteChangeEvent(hash)
            return
        }

        this.routes = this.routes ?? []
        if(!this.routes.find(route => route.id === '/error')) {
            this.routes.push({id: '/error', template: 'error.html'})
        }

        let route = this.routes.find(r => r.id === hash)
        if(!route) {
            this.navigateTo(`/error?from=${hash}`)
            return
        }

        if(route.template.startsWith('@')) {
            route = this.routes.find(r => r.id === route.template.substring(1))
            if(route) {
                this.navigateTo(route.id)
                return
            } else {
                this.navigateTo(`/error?from=${hash}`)
                return 
            }
        }

        const templatePath = (this.baseUrl + route.template)
            .replace(`//`, `/`)
        const response = await fetch(templatePath)
        const pageStr = await response.text()
        this.appElement.innerHTML = pageStr
        document.title = `R: ${hash}`
        this.#invokeScripts(this.appElement)
        if(!this.cache.has(hash)) {
            this.cache.set(hash, [...this.appElement.childNodes])
        }
    }

    async navigateTo(hash) {
        if(!hash) return
        if(!hash.startsWith('#')) hash = '#' + hash
        console.log('nav.hash', hash)
        window.location.hash = hash
    }

    // https://stackoverflow.com/questions/1197575/can-scripts-be-inserted-with-innerhtml
    #invokeScripts(node) {
        if(!node) return null

        const nodeScriptClone = (node) => {
            const script  = document.createElement("script")
            script.text = node.innerHTML

            for (let i = 0; i < node.attributes.length; i++) {
                const attrib = node.attributes[i];
                script.setAttribute(attrib.name, attrib.value)
            }

            return script
        }

        if (node.tagName.toUpperCase() === 'SCRIPT') {
            node.parentNode.replaceChild(nodeScriptClone(node), node)
        } else {
            for (const child of node.children) {
                this.#invokeScripts(child)
            }
        }
    }

    addRouteChangedEventListener(path, callback) {
        if(!callback || (typeof callback !== 'function'))
            return
        this.#eventListeners[path] ??= []
        this.#eventListeners[path].push(callback)
    }

    #onRouteChangeEvent(path) {
        ;(this.#eventListeners[path] ?? []).forEach(cb => {
            try {
                cb(path)
            } catch(e) {
                console.error(e)
            }
        })
    }
}
