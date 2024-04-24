
// unexepcted error, trying to use undefined b
try
{
    console.log(b)
}
catch (e) {
    console.error('error is:', e, e.name, e.message, e.stack)
}

// error is: ReferenceError: b is not defined
//    at code.js:3:17 ReferenceError b is not defined 
//    ReferenceError: b is not defined

// expected error
let result
const b = 0
let handle = 1
try
{
    if(b === 0) {
        // same as throw 'my error'
        throw new Error('my error')
    }
    
    result = handle / b
}
catch (e) {
    console.error('error is:', e, e.name, e.message, e.stack)
}
finally {
    handle = 0
    console.log('clean up')
}

// error is: Error: my error
//   at code.js:19:9 Error my error Error: my error

// 0
console.log(handle)
