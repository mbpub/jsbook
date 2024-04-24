import * as fs from 'node:fs/promises'
import * as path from 'path'
import HttpResponse from './httpResponse.js'

export default class StaticFiles {

    static async loadFile(urlPath) {
        if(!urlPath) urlPath = '/'
        if(urlPath === '/') urlPath = '/index.html'

        // handle folders
        if(urlPath.endsWith('/')) {
            return new HttpResponse(null, 'application/x-directory', 403)
        }
        
        const filePath = path.normalize(path.join('ui', urlPath))
        const mime = StaticFiles.#getMime(path.extname(filePath))
        console.log('FILE:', filePath, mime, urlPath)

        // check file exists
        try {
            await fs.access(filePath)
        } catch (e) {
            console.error('404', filePath, e)
            return HttpResponse.from404()
        }

        // read data
        const data = await fs.readFile(filePath)
        return new HttpResponse(data, mime)
    }

    static #getMime(fileExtension) {
        switch(fileExtension) {
            case '.txt':
            case '.md':
                return 'text/plain'
            case '.html':
                return 'text/html'
            case '.js':
                return 'text/javascript'
            case '.json':
                return 'application/json'
            case '.png':
                return 'image/png'
            case '.jpg':
            case '.jpeg':
                return 'image/jpeg'
            case '.ico':
                return 'image/vnd.microsoft.icon'
            default:
                return 'application/octet-stream'
        }
    }
}