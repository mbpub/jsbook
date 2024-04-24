import * as utils from './utils.js'

// values are [0, 1]
export default class NeuralNetwork {
    constructor(layers, learnRate = 1) {
        if(!layers || (layers.length < 2)) throw new Error('layers')
        this.layers = layers
        this.weights = []
        this.learnRate = learnRate

        // weights matrixes: (inputs + 1)x(outputs + 1); +1 for bias
        for(let i = 0; i < this.layers.length - 2; i++) {
            const inputsCount = layers[i]
            const outputsCount = layers[i + 1]
            const layerWeights = new Array(inputsCount + 1)
                .fill().map(_ => new Array(outputsCount + 1).fill(1))
            this.weights.push(layerWeights)
        }

        // last layer, no bias in output
        const inputsCount = layers[layers.length - 2]
        const outputsCount = layers[layers.length - 1]
        const layerWeights = new Array(inputsCount + 1)
            .fill().map(_ => new Array(outputsCount).fill(1))
        this.weights.push(layerWeights)

        this.#randomize()
    }

    #randomize() {
        // gaussian
        const normal = utils.normalRnd(0, 1)
        // for each layer
        for(let l = 0; l < this.weights.length; l++) {
            // 2D matrix
            const layerWeights = this.weights[l]
            // for each input x output 
            for(let i = 0; i < layerWeights.length; i++) {
                // scale factor to normalize node weight variance
                // layerWeights.length - 1 is same as layers[l]
                const scaleFactor =
                    Math.sqrt(layerWeights.length - 1)
                for(let j = 0; j < layerWeights[i].length; j++) {
                    layerWeights[i][j] = normal() / scaleFactor
                }
            }
        }
    }

    // X, Y are arrays of sample arrays
    fit(X, Y, iterations = 1) {
        if(X.length !== Y.length) 
            throw new Error('sample array length needs to match')

        const loss = new Array(X.length).fill(0)
        for(let e = 0; e < iterations; e++) {
            for(let s = 0; s < X.length; s++) {
                loss[s] = this.#fitOne(X[s], Y[s])
            }
        }

        return loss
    }

    #fitOne(x, y) {
        // to handle bias uniformly in this.weights
        x = this.#addBias(x)
        const activations = this.#feedforward(x)
        this.#backward(activations, y)
        return this.#computeLoss(x, y)
    }

    #addBias(x) {
        // clone
        x = x.slice()
        x.push(1)
        return x
    }

    predict(x, addBias = true) {
        if(addBias) {
            x = this.#addBias(x)
        }

        const activations = this.#feedforward(x)
        return activations[activations.length - 1]
    }

    #computeLoss(x, y) {
        const p = this.predict(x, false)
        return NeuralNetwork.error(y, p)
    }

    static error(desired, predicted) {
        // ((desired - predicted) ** 2) / 2
        const loss = predicted
            .map((output, idx) => Math.pow(desired[idx] - output, 2))
            .reduce((acc, error) => acc+=error, 0.0) / 2
        return loss
    }

    #feedforward(x) {
        const activations = [ x ]

        // for each layer
        for(let l = 0; l < this.weights.length; l++) {
            const layerWeights = this.weights[l]
            const layerInputs = activations[l]
            const layerOutputs = new Array(layerWeights[0].length).fill()
            
            for(let j = 0; j < layerOutputs.length; j++) {
                const dotProduct = layerInputs.reduce((acc, input, i) =>
                    acc += input * layerWeights[i][j], 0.0)
   
                layerOutputs[j] = NeuralNetwork.#sigmoid(dotProduct)
            }

            activations.push(layerOutputs)
        }

        // layer[i] input is in activations[i]
        // layer[i] output is in activations[i+1]
        return activations
    }

    #backward(activations, y) {
        const deltas = []

        // last layer
        const outputs = activations[activations.length - 1]
        const errors = outputs.map((output, idx) => output - y[idx])
        const layerDeltas = errors.map((error, idx) =>
            error * NeuralNetwork.#sigmoidDerivative(outputs[idx]))
        deltas.push(layerDeltas)

        const currentLayerDeltas =
        (prevLayerWeights, prevLayerDeltas, layerActivations) => {
            // prevLayerDeltas.length === prevLayerWeights[0].length
            // layerDeltas.length === prevLayerWeights.length <- input length
            //                    === layerActivations.length
            
            const layerDeltas = new Array(prevLayerWeights.length).fill()
            for(let i = 0; i < prevLayerWeights.length; i++) {
                const dotProduct = prevLayerDeltas.reduce((acc, delta, j) =>
                    acc += delta * prevLayerWeights[i][j], 0.0)
                layerDeltas[i] = dotProduct
                    * NeuralNetwork.#sigmoidDerivative(layerActivations[i])
            }

            return layerDeltas
        }

        // backwards
        for(let l = activations.length - 2; l >= 0; l--) {
            const layerOutputs = activations[l]
            const prevLayerWeights = this.weights[l]
            const prevLayerDeltas = deltas[deltas.length - 1]
            const layerDeltas = currentLayerDeltas(prevLayerWeights,
                    prevLayerDeltas, layerOutputs)
            deltas.push(layerDeltas)
        }

        deltas.reverse()

        for(let l = 0; l < this.weights.length; l++) {
            const layerWeights = this.weights[l]
            const layerInput = activations[l]
            const layerDeltas = deltas[l + 1]
            for(let i = 0; i < layerWeights.length; i++) {
                for(let j = 0; j < layerWeights[i].length; j++) {
                    const gradient = -this.learnRate
                        * layerDeltas[j] * layerInput[i]
                    layerWeights[i][j] += gradient
                }
            }
        }
    }

    static #sigmoid = (x) => 1 / (1 + Math.exp(-x))

    static #sigmoidDerivative = (x) => x * (1 - x)

    static minMax(array) {
        return array
            .reduce((a, b) => [Math.min(a[0], b), Math.max(a[1], b)],
            [Infinity, -Infinity])
    }

    static normalize(X, minMax = null) {
        if(!minMax || minMax.length !== 2) {
            minMax = NeuralNetwork.minMax(
                    X.flatMap(x => NeuralNetwork.minMax(x)))
        }

        return X.map(x => x = x.map(xi =>
            utils.norm(xi, minMax[0], minMax[1])))
    }

    static heavySide(x) { return x > 0.5 ? 1 : 0 }

    clone() {
        return Object.assign(new NeuralNetwork([1, 1]), JSON.parse(JSON.stringify(this)))
    }

    toString() {
        return `NN: ${this.layers.join(',')}`
    }
}

/*
E = ((Desired - Predicted) ** 2) / 2
dE/dWeight = dE/dPredicted * dPredicted / dSigmoid * dSigmoid / dW * dW/dInput
dW/dInput = Input
*/
