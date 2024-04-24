export class Search {
    static #parentNode = Symbol('parentNode')
    // https://en.wikipedia.org/wiki/Depth-first_search
    // return false from visitor.shouldStop to stop search
    // visitor = { enterNode, leaveNode, shouldStop }
    static dfsRecursive(node, visitor, reportNodePath = false) {
        if (!node) return
        if (!visitor) throw new Error('visitor')
        visitor = Search.#defaultVisitor(visitor)
        Search.#dfs(node, visitor, new Set(), reportNodePath ? [] : null)
    }

    static #dfs(node, visitor, visited, pathStack) {
        if (!node) return
        if (visitor.shouldStop()) return
        if (visited.has(node.key)) return
        visited.add(node.key)
        
        if (pathStack) pathStack.push(node)
        const pathStackCb = pathStack
                ? () => Array.from(pathStack)
                : null

        const skipChildProcessing = visitor.enterNode(node, pathStackCb)
        if (visitor.shouldStop()) return
        
        if(!skipChildProcessing && node.neighbors) {
            for (let child of node.neighbors) {
                Search.#dfs(child, visitor, visited, pathStack)
            }
        }

        visitor.leaveNode(node, pathStackCb)
        if (visitor.shouldStop()) return
        if (pathStack) pathStack.pop(node)
    }

    static dfs(node, visitor, reportNodePath = false) {
        if (!node) return
        const visited = new Set()
        visitor = Search.#defaultVisitor(visitor)
        const stack = []

        stack.push(node)

        while (stack.length) {
            //dequeue
            node = stack.pop()
            if (visited.has(node.key)) continue
            visited.add(node.key)

            const pathStackCb = reportNodePath
                ? () => Search.#getBfsPath(node)
                : null

            const skipChildProcessing = visitor.enterNode(node, pathStackCb)
            if(visitor.shouldStop()) return

            if(!skipChildProcessing && node.neighbors) {
                node.neighbors.forEach(child => {
                    if(child) {
                        child[Search.#parentNode] = node
                        stack.push(child)
                    }
                })
            }

            visitor.leaveNode(node, pathStackCb)
            if(visitor.shouldStop()) return
        }
    }

    // https://en.wikipedia.org/wiki/Breadth-first_search
    // return false from visitor.shouldStop to stop search
    // visitor = { enterNode, leaveNode, shouldStop }
    static bfs(node, visitor, reportNodePath = false) {
        if (!node) return
        const visited = new Set()
        visitor = Search.#defaultVisitor(visitor)
        const queue = []
        
        // enqueue
        queue.push(node)

        while (queue.length) {
            //dequeue
            node = queue.shift()
            if (visited.has(node.key)) continue
            visited.add(node.key)

            const pathStackCb = reportNodePath
                ? () => Search.#getBfsPath(node)
                : null

            const skipChildProcessing = visitor.enterNode(node, pathStackCb)
            if(visitor.shouldStop()) return

            if(!skipChildProcessing && node.neighbors) {
                node.neighbors.forEach(child => {
                    if(child) {
                        child[Search.#parentNode] = node
                        queue.push(child)
                    }
                })
            }

            visitor.leaveNode(node, pathStackCb)
            if(visitor.shouldStop()) return
        }
    }

    static #getBfsPath(node) {
        const resultPath = []
        while(node) {
            resultPath.push(node)
            node = node[Search.#parentNode]
        }

        resultPath.reverse()
        return resultPath
    }

    static #defaultVisitor(visitor) {
        visitor = visitor ?? {}
        visitor.enterNode = visitor.enterNode ?? (() => false)
        visitor.leaveNode = visitor.leaveNode ?? (() => false)
        visitor.shouldStop = visitor.shouldStop ?? (() => false)
        return visitor
    }
}

export class Node {
    
    #key
    #value
    #neighbors

    constructor(key, value, neighbors) {
        this.#key = key
        this.#neighbors = neighbors
        this.#value = value
    }

    get key() {
        return this.#key
    }

    get value() {
        return this.#value
    }

    get neighbors() {
        return this.#neighbors
    }

    toString() {
        return this.key.toString()
    }
}
