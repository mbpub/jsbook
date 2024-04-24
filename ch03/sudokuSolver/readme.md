# Example: Sudoku

This example is **not** included in the book.

Recursive brute-force search to solve `9x9` Sudoku, using *backtracking*.

```
solve() :=

foreach free <cell> {
    foreach <number> in [1-9] {
        if valid <cell> <= <number> {
            <cell> <= <number>

            // deeper
            if(solve()) {
                return true
            }
            
            // backtrack
            <cell> <= free
        }
    
        return false
    }
}

return true
```

**More Information:**

* [https://en.wikipedia.org/wiki/Sudoku](https://en.wikipedia.org/wiki/Sudoku)
