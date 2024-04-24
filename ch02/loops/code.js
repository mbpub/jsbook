// 0 1 2 3 4 5 6 7 8 9
for(let i = 0; i < 10; i++) {
    console.log(i)
}

// error, i is not defined outside loop	
try{
  console.log(i)
}catch(e) {
  console.log(e)
}

let i = 0
for(; i < 10; i++) {
    console.log(i)
}

// i = 10 here
console.log(i)

// 0 1 3 4 5
for(let i = 0; i < 10; i++) {
  if(i == 2) continue
  if(i > 5) break
    console.log(i)
}

let j = 0;
for (;;) {
  if (j > 3) break
  console.log(j)
  j++;
}

j = 0;
while(true) {
  if (j > 3) break
  console.log(j)
  j++
}

j = 0;
while(j <= 3) {
  console.log(j)
  j++
}

j = 0;
do {
    console.log(j)
  j++
} while(j <= 3)

//------------------

let n = 10
for(let i = 0; i < n; i++) {
  for(let j = 0; j < n; j++) {
    console.log('ij=', i, j)
  }
}

//------------------

for(let i = 0; i < 10; i++) {
  console.log('loop', i)
}

function printNumbers(max, current) {
current ??= 0
if(current >= max)
{
  return    
}
console.log('printNumbers', current)
printNumbers(max, current + 1)
}

printNumbers(10)