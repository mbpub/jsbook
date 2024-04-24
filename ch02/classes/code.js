// object literal

const object = {
    a: 1,
    b: 2,
    c: 0,
    sum: function() {
        this.c =  this.a + this.b
        return this.c
    }
}

// object 3
console.log('object', object.sum(), object.c)

// ['a', 'b', 'c', 'sum']
console.log('keys', Object.keys(object))
// ['a', 'b', 'c', 'sum']
console.log('own', Object.getOwnPropertyNames(object))
// [1, 2, 3, f]
console.log('values', Object.values(object))
// array of ['a', 1], ...
console.log('entries', Object.entries(object))

const object1 = {}
// copy enumerable own properties of object to object1
Object.assign(object1, object)
// {a: 1, b: 2, c: 3, sum: ƒ}
console.log('assign', object1)

for(const key in object) {
    if(Object.hasOwn(object, key)) {
        console.log('key', key, object[key])
    }
}

const objects = [
    { a: 1, b: '1' },
    { a: 2, b: '3' },
    { a: 3, b: '2' },
    { a: 4, b: '2' },
    { a: 5, b: '3' },
    { a: 6, b: '2' },
    { a: 7, b: '1' }
]

const groupBy = (objects, key) =>
    objects.reduce((acc, curr) => {
        const temp = acc.get(curr[key]) ?? []
        temp.push(curr)
        acc.set(curr[key], temp)
        return acc
    }, new Map())

// { '1': [ {... b: '1'} ], '2': ... }
console.log('groupBy', groupBy(objects, 'b'))

//-----------------------------------------------

// class 

class MyClass1 {
    constructor(a = 1, b = 2) {
        this.a = a
        this.b = b
        this.c = 0
    }

    sum() {
        this.c =  this.a + this.b
        return this.c  
    }
}

const object11 = new MyClass1()
const object12 = new MyClass1()

// class 3 3
console.log('class', object11.sum(), object11.c)
// class 0
console.log('class', object12.c)

// function
console.log('class type', typeof MyClass1, MyClass1.prototype)

//------------------------------------

class MyClass2 {
    #b
    #lastResult = 0

    constructor(a = 1, b = 2) {
        this.a = a
        this.b = b
        this.c = 0
    }

    divide() {
        return this.#secretDivide()
    }

    #secretDivide() {
        this.#lastResult =  this.a / this.b
        return this.#lastResult 
    }

    get b () {
        return this.#b
    }

    set b (value) {
        if(Math.abs(value) < 0.000001) throw 'NaN'
        this.#b = value
    }

    static ClassMethod1() {
        return new MyClass2(3, 4).divide()
    }

    toString() {
        return `${this.a}/${this.b} = ${this.#lastResult}`
    }
}

const object21 = new MyClass2()

// class 0.5 1/2 = 0.5 0.75
console.log('class', object21.divide(),
    object21.toString(), MyClass2.ClassMethod1())

// ------------------------------

class Animal {
    constructor(careTaker = null) {
        this.careTaker = careTaker
        console.log('constructor', this.toString())
    }

    toString() {
        return `Animal: ${this.careTaker}`
    }
}

class Mammal extends Animal {
    constructor(hasMilk = false, careTaker = null) {
        super(careTaker)
        this.hasMilk = hasMilk
        console.log('constructor', this.toString())
    }

    toString() {
        return `Mammal: ${this.hasMilk} --> ${super.toString()}`
    }
}

class Dog extends Mammal {
    constructor(canBark = true, hasMilk = false, careTaker = null) {
        super(hasMilk, careTaker)
        this.canBark = canBark
        console.log('constructor', this.toString())
    }

    toString() {
        return `Dog: ${this.canBark} --> ${super.toString()}`
    }
}

class Cat extends Mammal {
    constructor(mouseCatchCount = 0, hasMilk = false, careTaker = null) {
        super(hasMilk, careTaker)
        this.mouseCatchCount = mouseCatchCount
        console.log('constructor', this.toString())
    }

    toString() {
        return `Cat: ${this.mouseCatchCount} --> ${super.toString()}`
    }
}

const dog =new Dog(true, false, 'bob')
const cat = new Cat(2, true, 'me')

// Dog: true --> Mammal: false --> Animal: bob 
// Cat: 2 --> Mammal: true --> Animal: me
console.log(dog.toString(), cat.toString())

// false true true
console.log(dog instanceof Dog, dog instanceof Cat, dog instanceof Mammal)

// (2) ['bob', 'me']
console.log([dog, cat].map(_ => _.careTaker))
