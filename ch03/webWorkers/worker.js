// chrome supports this
import Secrets from './secrets.js'

self.onmessage = function(event) {
    console.log('worker', event.data)
    const cmd = event.data.cmd
    switch(cmd) {
        case 'process':
            const payload = event.data.payload
            switch(payload.method) {
                case 'encrypt':
                    Secrets.encode(payload)
                    .then(res => postMessage({ cmd, message: res }))
                    .catch(e => postMessage({cmd, message: `Error: ${e}`}))
                    break
                case 'decrypt':
                    Secrets.decode(payload)
                    .then(res => postMessage({cmd, message: res}))
                    .catch(e => postMessage({cmd, message: `Error: ${e}`}))
                    break
                default:
                    console.error('invalid payload.method', payload.method)
                    break
            }
            break
        default:
            console.error('invalid cmd', e.data.cmd)
            break
    }
}
