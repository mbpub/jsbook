export default class HttpResponse {

    static from404() {
        return new HttpResponse(null, 'text/plain', 404)
    }

    static from500(error) {
        return new HttpResponse(
            (error ?? 'error').toString(),
            'text/plain',
            500)
    }

    constructor(data, mimeType = 'application/json', httpCode = 200) {
        this.data = data
        this.mimeType = mimeType
        this.httpCode = httpCode
    }

    writeTo(res) {
        // write HTTP head
        res.writeHead(this.httpCode, { 'Content-Type': this.mimeType })
        // write body
        res.end(this.data)
    }
}
