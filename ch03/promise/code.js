class AsyncGenerator
{
    static async *pow10(n = 5) {
        for(let i = 0; i < n; i++) {
            yield new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(Math.pow(10, i))
                }, 500)
            })
        }
    }

    static async test() {
        for await(let n of this.pow10()) {
            console.log(n)
        }
    }
}

// 1, 10, 100, 1000, 10000
AsyncGenerator.test().catch(e => console.error(e))
