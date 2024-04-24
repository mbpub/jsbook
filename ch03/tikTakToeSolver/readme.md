# Example: Tic-Tak-Toe

This example is **not** included in the book.

Computer solved Tic-Tak-Toe using **Minimax** algorithm.
Minimax is a recursive brute-force search with backtracking.

```
minimax(board, depth, isMaximizingPlayer) :=
    foreach board <cell>
        if terminal state
            return value of board
            if isMaximizingPlayer
            best = -INFINITY
            foreach MaximizingPlayer next move:
                do move
                best = max(best, minimax(board, depth + 1, false))
                backtrack move
            return best
        else
            bestVal = +INFINITY
            foreach MinimizingPlayer next move:
                do move 
                best = min(best, minimax(board, depth + 1, true))
                backtrack move
            return best
```

**More Information:**

* [https://en.wikipedia.org/wiki/Tic-tac-toe](https://en.wikipedia.org/wiki/Tic-tac-toe)
* [https://en.wikipedia.org/wiki/Minimax](https://en.wikipedia.org/wiki/Minimax)
* [https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/](https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/)