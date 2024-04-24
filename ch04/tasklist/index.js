#!/usr/bin/env node

import * as http from 'http'
import { URL } from 'url'
import StaticFiles from './staticFiles.js'
import HttpResponse from './httpResponse.js'
import Api from './api.js'

const api = new Api()
const serverPort = 4000
console.log(`server starting at: http://127.0.0.1:${serverPort}/`)

const server = http.createServer(async (req, res) => {
    try {
        const method = req.method
        const url = new URL(req.url, `http://127.0.0.1:${serverPort}/`)
        switch(method) {
            case 'GET':
                if(url.pathname.startsWith('/api/')) {
                    ;(await api.get(
                        url.pathname,
                        Object.fromEntries(url.searchParams)))
                        .writeTo(res)
                } else {
                    ;(await StaticFiles.loadFile(url.pathname))
                        .writeTo(res)
                }
                break
            case 'POST':
                if(url.pathname.startsWith('/api/')) {
                    const body = await readTextBody(req)
                    ;(await api.post(
                        url.pathname,
                        JSON.parse(body)))
                        .writeTo(res)
                } else {
                    new HttpResponse.from404()
                        .writeTo(res)
                }
                break
            default:
                throw new Error(`not supported HTTP method: ${method}`)
        }
    } catch(e) {
        console.error('ServerError:', e)
        HttpResponse.from500(e).writeTo(res)
    }
})

const readTextBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = ''

        req.on('data', chunk => {
            body += chunk.toString()
        })

        req.on('end', () => {
            resolve(body)
        })
    })
}

// Error: listen EADDRINUSE: address already in use 127.0.0.1:4000
server.listen(serverPort, '127.0.0.1')
