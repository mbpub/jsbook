export default class Task {

    constructor(title = '', details = '', before = [], after = []) {
        this._id = null
        this.title = title
        this.details = details
        this.before = before ?? []
        this.after = after ?? []
    }

    static fromObject(objectLiteral){
        return Object.assign(new Task(), objectLiteral)
    }
}
