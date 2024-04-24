import HttpResponse from './httpResponse.js'

export default class Api {
    async get(urlPath, data) {
        console.log('API.GET:', urlPath, data)
        return HttpResponse.from404()
    }

    async post(urlPath, data) {
        console.log('API.POST:', urlPath, data)
        return HttpResponse.from404()
    }
}