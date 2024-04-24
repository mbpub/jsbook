import NeuralNetwork from '../../common/nn.js'
import * as utils from '../../common/utils.js'

const nn = new NeuralNetwork([3, 10, 10, 10, 3])
const colorPicker = document.getElementById('colorPicker')
const svg = document.getElementById('clothes')

const handler = ()=> {
    const svgDocument = svg.contentDocument
    const shirt = svgDocument.getElementById('shirt')
    const trousers = svgDocument.getElementById('trousers')

    // fill is needed for click to work
    shirt.setAttribute('style',
        'fill:#ff0000;stroke:#000000;stroke-width:1')
    trousers.setAttribute('style',
        'fill:#ffffff;stroke:#000000;stroke-width:1')

    // color picker
    let currentSvgPath = shirt
    let lastColor = { shirt: '#ff0000', trousers: '#ffffff'}
    const showColorPicker = (svgPath) => {
        currentSvgPath = svgPath
        document.getElementById('color').value
            = lastColor[currentSvgPath.id]
        document.getElementById('colorLabel').innerText
            = `Select color for: ${svgPath.id}`
        colorPicker.style.display = 'block'
    }
    document.getElementById('colorApply')
        .addEventListener('click', event => {
        const color = document.getElementById('color').value
        console.log('color', color)
        currentSvgPath.setAttribute('style',
            `fill:${color};stroke:#000000;stroke-width:1`)
        lastColor[currentSvgPath.id] = color
        colorPicker.style.display = 'none'
    })
    document.getElementById('colorCancel')
        .addEventListener('click', event => {
        colorPicker.style.display = 'none'
    })

    // clothes color picker
    shirt.addEventListener('click', event => {
        showColorPicker(shirt)
    })

    trousers.addEventListener('click', event => {
        showColorPicker(trousers)
    })

    // nn
    const getFeatureVector = (svgPath) => {
        const color = lastColor[svgPath.id]
        console.log('get', svgPath.id, color)
        const parts = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
            .exec(color)
        parts.shift()
        return parts
            .map(_ => parseInt(_, 16)).map(_ => utils.norm(_, 0, 255))
    }

    const predicted2Rgb = (y) =>
        y.map(_ => Math.floor(utils.range(_, 0, 1, 0, 255)))
    
    document.getElementById('nnPredict')
        .addEventListener('click', event => {
        const x = getFeatureVector(shirt)
        console.log('x', x)
        const y = nn.predict(x)
        const color = '#' + predicted2Rgb(y).map(_ => {
            const hex = _.toString(16)
            return hex.length === 1 ? `0${hex}` : hex
            }).join('')
        console.log('set', trousers.id, color,
            y.map(_ => Math.floor(utils.range(_, 0, 1, 0, 255))))
        trousers.setAttribute('style',
                `fill:${color};stroke:#000000;stroke-width:1`)
        lastColor[trousers.id] = color
    })
    document.getElementById('nnTrain')
        .addEventListener('click', event => {
        const x = getFeatureVector(shirt)
        const y = getFeatureVector(trousers)
        console.log('train loss', nn.fit([x], [y], 1000))
    })

    // auto train
    const autoTrain = () => {
        const X = [[255, 0, 0],
            [0, 255, 0], [0, 0, 255], [255, 255, 255], [0, 0, 0]]
        const Y = [[0, 255, 255],
            [0, 255, 0], [255, 0, 0], [0, 0, 0], [0, 0, 255]]
        nn.fit(NeuralNetwork.normalize(X, [0, 255]),
            NeuralNetwork.normalize(Y, [0, 255]), 10000)
        X.forEach((x, i) => {
            const p = nn.predict(x)
            console.log('input', x, 'target', Y[i],
                'predicted', predicted2Rgb(p))
        })
    }

    autoTrain()
}

window.addEventListener('load', event => {
    handler()
})
