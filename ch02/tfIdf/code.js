const documents = [
    'dog and cat love each other',  // index 0
    'dog dances in rain',           // index 1
    'cat dances to music',          // index 2
    'rain cat and dog',             // index 3
    'dog and cat love rain'         // index 4
]

console.log('documents', documents)
const tokenizedDocuments = documents.map(document => document.split(' '))

console.log('tokenizedDocuments', tokenizedDocuments)

// key=word=token, value=a Set with documents index contain word
let tokenDocumentCount = new Map()

tokenizedDocuments.map((tokenizedDocument, index) => {
    tokenizedDocument.map(token => {
        // find value for key=word in tokenDocumentCount
        let documentIndexesThatContainToken = tokenDocumentCount.get(token)
        
        // create value Set if not created already
        if(!documentIndexesThatContainToken) {
            documentIndexesThatContainToken = new Set()
            tokenDocumentCount.set(token, documentIndexesThatContainToken)
        }

        // calling Set.add a second time with same index does nothing
        documentIndexesThatContainToken.add(index)
    })
})

console.log('tokenDocumentCount', tokenDocumentCount)

// reduce document index Set to its size = unique documents count
// we convert tokenDocumentCount.entries() to array via ...
tokenDocumentCount = new Map([...tokenDocumentCount.entries()]
    .map(entry => [ entry[0], entry[1].size ]))
console.log('tokenDocumentCount size', tokenDocumentCount)

const idf = new Map([...tokenDocumentCount.entries()].map(entry => [ 
    entry[0],
    Math.log((tokenizedDocuments.length + 1) / (entry[1] + 1)) + 1]))

console.log('idf', idf)

const sortedTokens = [...idf.keys()].sort()
console.log('sortedTokens', sortedTokens)

const tfIdfDocuments = tokenizedDocuments.map(tokenizedDocument => {
    // find token count in document
    const tokenCount = tokenizedDocument.reduce((accumulator, token) => 
        accumulator.set(token, (accumulator.get(token) || 0) + 1), new Map())

    const tfIdDocument = sortedTokens.map(sortedToken => {
        const documentHasToken = tokenCount.has(sortedToken)
        const tf = documentHasToken
            ? tokenCount.get(sortedToken) / tokenizedDocument.length
            : 0
        const tfId = tf ? tf * idf.get(sortedToken) : 0
        return tfId
    })

    console.log('tfIdDocument', tfIdDocument)
    return tfIdDocument
})

console.log('tfIdfDocuments', tfIdfDocuments)

function cosineSimilarity(A, B) {
    const dotProduct = A.reduce((acc, Ai, i) => 
        acc += Ai * B[i], 0)
    const lengthA = Math.sqrt(A.reduce((acc, Ai) =>
        acc += Ai * Ai, 0))
    const lengthB = Math.sqrt(B.reduce((acc, Bi) =>
        acc += Bi * Bi, 0))
    return dotProduct / (lengthA * lengthB)
}

// tfIdfDocuments.length x tfIdfDocuments.length table filled with 0
const similarityMatrix = Array.from(Array(tfIdfDocuments.length), 
    () => new Array(tfIdfDocuments.length).fill(0));

tfIdfDocuments.forEach((tfIdfDocument1, index1) => {
    tfIdfDocuments.forEach((tfIdfDocument2, index2) => {
        if(index2 >= index1) {
            similarityMatrix[index1][index2] = 
                cosineSimilarity(tfIdfDocument1, tfIdfDocument2)
        }
    })
})

// show 2D array as table in Console
console.table(similarityMatrix)
