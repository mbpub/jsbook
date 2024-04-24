document.getElementById('toggle')
    .addEventListener('click', event => {
        const divC = document.getElementById('divC')
        divC.hidden = !divC.hidden
        /* same as
        switch(divC.style.display) {
            case 'none':
                divC.style.display = 'block'
                break
            default:
                divC.style.display = 'none'
                break
        }
        */
})

const firstUlElement = document.querySelector('#main > ul')
// ulMain
console.log(firstUlElement.id)

const elements = document.getElementById('main')
    .getElementsByClassName('foo')
for(let i = 0; i < elements.length; i++) {
    // same as elements.item(i)
    const element = elements[i]
    console.log(element.tagName, element.id)
}

// iteration via for ... of also works
for(const element of elements) {
    console.log(element.id)
}

// either via
const elementsThisCopy1 = Array.from(elements)
// or via
const elementsThisCopy2 = [...elements]

console.log(elementsThisCopy1.map(_ => _.id))
console.log(elementsThisCopy2.map(_ => _.id))

// get nested `li` elements and all `p` ones
const elements2 = document.querySelectorAll('#main > ul > li, p')

for(let i = 0; i < elements2; i++) {
    // same as elements.item(i)
    const element = elements2[i]
    console.log(element.tagName)
}

for (const element of elements2) {
    console.log(element.tagName)
}

const mainElement = document.getElementById('main')
// BODY
console.log('parent', mainElement.parentNode.tagName)
for (const child of mainElement.children) {
    // child DIV divA, child DIV divB
    console.log('child', child.tagName, child.id)
}

// not live yet
const newElement = document.createElement('p')
const newText = document.createTextNode('paragraph text')
newElement.appendChild(newText)

// element is live in DOM after appendChild() call
document.getElementById('main').appendChild(newElement)

// <div id="divC" class="foo boo">Some Text</div>
const divC = document.getElementById('divC')
// 'foo boo'
console.log(divC.className)
// DOMTokenList(2) ['foo', 'boo', value: 'foo boo']
console.log(divC.classList)
divC.classList.toggle('boo')
// foo
console.log(divC.className)
// false
console.log(divC.classList.contains('boo'))

// <a id="link1" href="http://google.com" target="new">Google</a>
const link1 = document.getElementById('link1')
// NamedNodeMap {0: id, 1: href, 2: target, id: id,
//            href: href, target: target, length: 3} 3
console.log(link1.attributes, link1.attributes.length)
// id="link1" 'id' 'link1'
console.log(link1.attributes[0],
        link1.attributes[0].name,
        link1.attributes[0].value)
// id="link1" 'id' 'link1'
console.log(link1.attributes['id'],
        link1.attributes['id'].name,
        link1.attributes['id'].value)

// returns null if not found
const elementA = document.getElementById('divA')
elementA.innerHTML = '<p>test</p>'