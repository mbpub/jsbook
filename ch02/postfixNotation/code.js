const tokens = '2 4 + 3 * 1 +'
    .split(' ')
    .map(part => Number(part) ? Number(part) : part)

// [2, 4, '+', 3, '*', 1, '+']
console.log(tokens)

const compute = (op, op1, op2) => {
    switch(op) {
        case '+': return op1 + op2
        case '-': return op1 - op2
        case '*': return op1 * op2
        case '/': return op1 / op2
        default:
            throw new Error(`invalid operator ${op}`)
    }
}

const stack = []
tokens.forEach(token => {
    const isOperand = typeof token === 'string'
    if(isOperand) {
        const op1 = stack.pop()
        const op2 = stack.pop()
        
        if(op1 === undefined || op2 === undefined) {
            throw new Error('invalid expression')
        }
        token = compute(token, op1, op2)
    }

    stack.push(token)
    console.log('temp stack', stack)
})

// 19
console.log('final stack', stack)

