export default class Mark {
    static X = 1
    static O = -1
    static EMPTY = 0
    
    static Tie = -9999

    static other(mark) {
        return mark === Mark.X ? Mark.O : Mark.X
    }

    static toSymbol(mark) {
        switch(mark) {
            case Mark.X: return 'X'
            case Mark.O: return '0'
            default: return ' '
        }
    }

    static toWinnerText(mark) {
        switch(mark) {
            case Mark.X: return 'X'
            case Mark.O: return '0'
            case Mark.Tie: return 'Tie'
            default: return ''
        }  
    }
}
