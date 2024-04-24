// same regex a+b
// one or more a-s followed by one b-s
const re1 = /a+b/
const re2 = new RegExp('(a+b)')

const text1 = 'ccaaaab'
const text2 = 'aabb'
const text3 = 'ccbaaa'

// true, true, false
console.log(re1.test(text1), re1.test(text2), re1.test(text3))
// ['aaaab', index: 2, ...], ['aab', idex: 0, ...], null
console.log(re1.exec(text1), re1.exec(text2), re1.exec(text3))

// JavaScript is cool, we will learn a lot of JavaScript here
console.log('HTML is cool, we will learn a lot of HTML here'
  .replaceAll(/HTML/g, 'JavaScript'))

// --------------------------------

const htmlDocument =
`<html>
  <head>
    <title>test</title>
  </head>    
  <body>
    <a class="c1" HREF = "page1">some link</a> <img src="img1" />
      <div>
        <ul>
          <li><a href="page2">some link <img src="img2" /></a></li>
          <li><a href="page3">some link</a><img src="img3" /></li>
          <li><span><a href="page4">some link</a></span></li>
        </ul>
      </div>
    <img src="img4" alt="footer" />
  </body>
</html>`

const hrefRegex = /<a[^>]*href\s*=\s*['"]([^'"]*)['"]>/gi

const matches1 = htmlDocument.matchAll(hrefRegex)
for (const match of matches1) {
    console.log(match[1])
}

// page1, page2, page3, page4

const imgSrcRegex = /<img[^>]*src\s*=\s*['"]([^'"]*)['"]/gi

const matches2 = htmlDocument.matchAll(imgSrcRegex)
for (const match of matches2) {
    console.log(match[1])
}

// img1, img2, img3, img4
