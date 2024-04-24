export default class MazeCell {
    static Start = '>'
    static Goal = '*'
    static Blocked = 'x'
    static Open = '0'

    static getTextAndColor(value) {
        switch(value) {
            case MazeCell.Blocked:
                return { text: value, color: 'lightpink' }
            case MazeCell.Start:
            case MazeCell.Goal:
                return { text: value, color: 'lightgreen' }
            case MazeCell.Open:
                return { text: ' ', color: 'white' }
            default:
                throw new Error(`no such cell type: ${value}`)
        }
    }

    static isValidChild(value) {
        return (value === MazeCell.Open)
            || (value === MazeCell.Goal)
    }

    static isStartOrGoal(value) {
        return (value === MazeCell.Start)
            || (value === MazeCell.Goal)
    }
}