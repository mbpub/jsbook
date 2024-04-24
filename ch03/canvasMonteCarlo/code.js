import * as utils from '../../common/utils.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
const result1 = document.getElementById('result1')
const result2 = document.getElementById('result2')

const img = new Image()
img.addEventListener('load', () => {
    console.log('w, h', img.naturalWidth, img.naturalHeight)
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    ctx.drawImage(img, 0, 0)
    
    computeSurfaceExact(img.naturalWidth, img.naturalHeight,
        ['255,0,0', '0,0,255']) 
    
    computeSurfaceMonteCarlo(img.naturalWidth, img.naturalHeight,
        ['255,0,0', '0,0,255'])    
})

// 225 * 186 = 41850 pixels
img.src = './surface.png'

// the implementation here is slow
const computeSurfaceExact = (
        imgWidth,
        imgHeight,
        surfaceColors) => {
    const total = imgWidth * imgHeight
    const idx = new Set(surfaceColors)
    let found = 0
    for(let x = 0; x < imgWidth; x++) {
        for(let y = 0; y < imgHeight; y++) {
            const temp = ctx.getImageData(x, y, 1, 1).data
            const pixel = `${temp[0]},${temp[1]},${temp[2]}`
            if(idx.has(pixel)) {
                found++
            }
        }
    }

    updateResult(found, total, total, result1)
}

const computeSurfaceMonteCarlo = (
        imgWidth,
        imgHeight,
        surfaceColors) => {
    const total = imgWidth * imgHeight
    const idx = new Set(surfaceColors)
    let found = 0, notFound = 0
    for(let i = 0; i < 1000; i++) {
        const x = utils.uniformRndInt(0, imgWidth)
        const y = utils.uniformRndInt(0, imgHeight)
        const temp = ctx.getImageData(x, y, 1, 1).data
        const pixel = `${temp[0]},${temp[1]},${temp[2]}`
        if(idx.has(pixel)) {
            found++
        }
        else {
            notFound++
        }
    }

    updateResult(found, found + notFound, total, result2)
}

const updateResult = (found, totalEst, total, result) => {
    const ratio = found / totalEst
    result.innerHTML =
        `${((ratio) * 100.0).toFixed(4)}%,
        surface ${Math.ceil(ratio * total)}`
}
