export class OrderedNode {
    constructor(key, beforeKeys, afterKeys, value = null) {
        this.key = key
        this.beforeKeys = beforeKeys
        this.afterKeys = afterKeys

        this.value = value

        this.frontier = -1
    }

    toString() {
        return `${this.key}: before= ${(this.beforeKeys || [])
            .join(' ')}, after= ${(this.afterKeys || []).join(' ')}`
    }
}

class Node {

    #key
    #children

    constructor(key, value) {
        // OrderedNode
        this.value = value
        this.#key = key
        this.#children = []
        this.inbound = 0
        this.frontier = -1
    }

    get key () {
        return this.#key
    }

    get children () {
        if(!this.#children) this.#children = []
        return this.#children
    }

    addChild(node) {
        if(!node) return
        this.children.push(node)
    }

    toString() {
        return `${this.key}: ${this.children.map(_ => _.key)
            .join(',')} #${this.inbound}, F: ${this.frontier}`
    }
}

export  class TopologicalSort {

    static #getNode(nodesMap, key, ignoreUnresolved) {
        if (!nodesMap.has(key)) {
            if(ignoreUnresolved) {
                return null
            }

            throw new Error(`cannot resolve: ${key}`)
        }

        return nodesMap.get(key)
    }
  
    // [OrderedNode, ...] => [ Node, ... ]
    static #createGraph(orderedNodes, ignoreUnresolved) {
        const nodeMap =
            new Map(orderedNodes.map(_ => [ _.key, new Node(_.key, _)]))
        orderedNodes.forEach(orderedNode => {
            const currentNode =
                this.#getNode(nodeMap, orderedNode.key, ignoreUnresolved)

            ;(currentNode.value.beforeKeys || []).forEach(key => {
                if(key === '*') {
                    const children = nodeMap
                        .filter(_ => _.key != currentNode.key)
                    for(const child of children) {
                        currentNode.children.Add(child)
                    }
                } else {
                    const childNode =
                        this.#getNode(nodeMap, key, ignoreUnresolved)
                    currentNode.addChild(childNode)
                }
            })

            ;(currentNode.value.afterKeys|| []).forEach(key => {
                if(key === '*') {
                    const parents = nodeMap
                        .filter(_ => _.key != currentNode.key)
                    for(const parent of parents) {
                        parent.children.Add(currentNode)
                        
                    }
                } else {
                    const parentNode =
                        this.#getNode(nodeMap, key, ignoreUnresolved)
                    parentNode.addChild(currentNode)
                }
            })
            
        })

        return nodeMap.values()
    }
  
    static #calcIncomingEdges(nodes) {
        for(const node of nodes) {
            node.children.forEach(child => {
                if (!child.inbound) child.inbound = 1
                else child.inbound += 1
            })
        }
    }
  
    // dependencies [OrderedNode, ...]
    static sort(orderedNodes, ignoreUnresolved = false) {
        if (!orderedNodes) return []
        const nodes = [...this.#createGraph(orderedNodes, ignoreUnresolved)]
        this.#calcIncomingEdges(nodes)
        const queue = nodes.filter(_ => _.inbound <= 0)
        const ordered = []

        if (queue.length) {
            queue.push(null)
        }

        let frontier = -1
        while (queue.length) {
            const node = queue.shift()

            if(!node) {
                if (queue.length) {
                    queue.push(null)
                }

                if (ordered.length) {
                    frontier++
                    for(let i = ordered.length - 1;
                        (i >= 0) && (ordered[i].frontier === -1); i--) {
                        ordered[i].frontier = frontier
                    }
                }

                continue
            }

            node.children.forEach(child => {
                child.inbound -= 1
                if (!child.inbound) {
                    queue.push(child)
                }
            })
            
            ordered.push(node)
        }

        if (ordered.length !== nodes.length) {
            throw new Error('ordering is not possible')
        }

        return ordered.map(_ => {
            _.value.frontier = _.frontier
            return _.value
        })
    }
}
