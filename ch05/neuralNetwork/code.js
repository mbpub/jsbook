import NeuralNetwork from '../../common/nn.js'
import NnVisualizer from './nnVisualizer.js'


console.log('XOR ------------------------------------------')

const nn1 = new NeuralNetwork([2, 2, 1])

// XOR data set
const X = [[0, 0], [0, 1], [1, 0], [1, 1]]
const Y = [[0], [1], [1], [0]]

console.log('loss', nn1.fit(X, Y, 10000))
console.log(nn1)

X.forEach((x, idx) => {
    const p = nn1.predict(x)
    console.log('feature', x,
        'target', Y[idx],
        'predicted', p, p.map(_ => NeuralNetwork.heavySide(_)),
        'error',  Y[idx][0] - NeuralNetwork.heavySide(p[0]))
})

console.log('SIN ------------------------------------------')

const nn2 = new NeuralNetwork([1, 2, 3, 1])
const X2 = []
const Y2 = []
for(let x = 0.0; x <= 1.0; x+=0.1) {
    X2.push([x])
    Y2.push([Math.sin(x)])
}

//console.log(X2, NeuralNetwork.normalize(X2, [0, 1]))
//console.log(Y2, NeuralNetwork.normalize(Y2, [0, 1]))

console.log('loss', nn2.fit(X2, Y2, 1000))
console.log(nn2)

for(let x = 0.0; x <= 1.0; x+= 0.125) {
    const p = nn2.predict([x])
    console.log('feature', x,
        'target', Math.sin(x),
        'predicted', p,
        'error', (Math.sin(x) - p[0]).toFixed(4))
}

document.getElementById('app').innerHTML = NnVisualizer.toSvg2(nn2)
