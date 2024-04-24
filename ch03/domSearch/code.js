import * as DfsBfs from '../../common/dfsBfs.js'

const visitor = {
    stop: false,

    enterNode: function(node, pathStack) {
        console.log('enter:', node.key, pathStack().map(_ => _.key))
    },

    leaveNode: function(node, pathStack) {
        console.log('leave:', node.key, pathStack().map(_ => _.key))
    },

    shouldStop: function() {
        return this.stop
    }
}

/*
 A
B C
  D E
    F
*/
const graph = new DfsBfs.Node(
    'A', null, [
       new DfsBfs.Node('B', null, null),
       new DfsBfs.Node('C', null, [
            new DfsBfs.Node('D', null),
            new DfsBfs.Node('E', null, [
                new DfsBfs.Node('F', null)
            ])
       ]) 
    ]
)

console.log('BFS')
DfsBfs.Search.bfs(graph, visitor, true)

console.log('DFS')
DfsBfs.Search.dfs(graph, visitor, true)

console.log('DFS.Recursive')
DfsBfs.Search.dfsRecursive(graph, visitor, true)

class DomNode extends DfsBfs.Node {
    constructor(domNode) {
        super(domNode, domNode, {})
    }

    get neighbors() {
        return [...this.value.children].map(_ => new DomNode(_))
    }
}

console.log('DFS.Dom')
DfsBfs.Search.dfs(new DomNode(document.getElementById('A')), visitor, true)

const queryAllByClass = (className) => {
    const res = []
    const visitor = {
        enterNode: function(node, pathStack) {
            if(node.value.className === className) {
                res.push(node)
            }
        }
    }
    DfsBfs.Search.dfs(new DomNode(document.body), visitor, true)
    return res.map(_ => _.value)
}

console.log(queryAllByClass('foo').map(_ => _.id))
