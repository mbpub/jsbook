export default class NnVisualizer {

    static toSvg2(nn, width = 480, height = 640) {
        const ns = 'http://www.w3.org/2000/svg'
        const image = document.createElementNS(ns, 'svg')
        image.setAttribute('width', width ?? 480)
        image.setAttribute('height', height ?? 640)

        for(let l = 0; l < nn.weights.length; l++) {
            const isLastLayer = l === nn.weights.length - 1
            const layerWeights = nn.weights[l]
            const inputsCount = layerWeights.length - 1
            const outputCount = isLastLayer
                ? layerWeights[0].length
                : layerWeights[0].length - 1
            
            const y = 10 + 200 * l

            // create a group g per each layer
            const layerElement = document.createElementNS(ns, 'g')
            image.appendChild(layerElement)
            layerElement.id = `L${l + 1}`
            // show layer size as text
            const layerTitleElement =
                document.createElementNS(ns, 'text')
            layerElement.appendChild(layerTitleElement)
            layerTitleElement.setAttribute('x', '10')
            layerTitleElement.setAttribute('y', `${y + 4}`)
            layerTitleElement.appendChild(
                document.createTextNode(`LAYER#${(l + 1)}:
                    Inputs=${inputsCount}, Outputs=${outputCount}`))

            for(let i = 0; i < layerWeights.length; i++) {
                const xI = 10 + i * 80
                const yI = y + 10
                const colorI = (i === layerWeights.length - 1)
                    ? 'gray' : 'green'
                
                // draw weights as path lines
                for(let j = 0; j < layerWeights[i].length; j++) {
                    NnVisualizer.#drawWeights(layerElement,
                        ns, y, xI, yI, l, i, j, layerWeights)
                }

                // draw outputs as rects
                const inputElement =
                    document.createElementNS(ns, 'rect')
                layerElement.appendChild(inputElement)
                inputElement.setAttribute('width', '10')
                inputElement.setAttribute('height', '10')
                inputElement.setAttribute('fill', colorI)
                inputElement.setAttribute('x', xI)
                inputElement.setAttribute('y', yI)

                // draw outputs as circles
                for(let j = 0; j < layerWeights[0].length; j++) {
                    const xO = 10 + j * 80
                    const yO = y + 140
                    const colorO = !isLastLayer
                        && (j === layerWeights[0].length - 1)
                        ? 'gray' : 'orange'

                    const outputElement =
                        document.createElementNS(ns, 'circle')
                    layerElement.appendChild(outputElement)
                    outputElement.setAttribute('r', '5')
                    outputElement.setAttribute('fill', colorO)
                    outputElement.setAttribute('cx', xO)
                    outputElement.setAttribute('cy', yO)
                }
            }
        }

        // we appendChild(image) or as we do here,
        // we can get the svg text and use innerHTML to set that
        const serializer = new XMLSerializer()
        const xml = serializer.serializeToString(image)
        // console.log(xml)
        return xml
    }

    static #drawWeights(layerElement,
        ns, y, xI, yI, l, i, j, layerWeights) {
        const xO = 10 + j * 80
        const yO = y + 140
        const pathId = `L${l + 1}-W${i + 1}-${j + 1}`

        const weightElement = document.createElementNS(ns, 'g')
        layerElement.appendChild(weightElement)
        weightElement.id = pathId
        const lineElement = document.createElementNS(ns, 'path')
        weightElement.appendChild(lineElement)
        lineElement.id = `P-${pathId}`
        lineElement.setAttribute('d',
            `M ${xI + 5} ${yI + 5} L ${xO} ${yO} Z`)
        lineElement.setAttribute('style',
            'fill:none;stroke:gray;stroke-width:1')
        const textElement = document.createElementNS(ns, 'text')
        weightElement.appendChild(textElement)
        textElement.setAttribute('style', 'font-size: 10pt')
        const textPathElement = document
            .createElementNS(ns, 'textPath')
        textElement.appendChild(textPathElement)
        textPathElement.setAttribute('href', `#${lineElement.id}`)
        textPathElement.setAttribute('startOffset', '70%')
        textPathElement.appendChild(
            document.createTextNode(`${layerWeights[i][j]
                .toFixed(2)}`))
    }
}
