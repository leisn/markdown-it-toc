# @leisn/markdown-it-toc

![GitHub](https://img.shields.io/github/license/leisn/markdown-it-toc) ![npm (scoped)](https://img.shields.io/npm/v/@leisn/markdown-it-toc)

Markdown-it plugin to make table of contents, default parse tag [toc].


## Installaton

```bash
$ npm install @leisn/markdown-it-toc
or
$ yarn add @leisn/markdown-it-toc
```

## E.g. default

### Source markdown

```markdown
[toc]
# H1-1
## H2-1
### H3-1
# H1-2
```
### Result document
```html
<p>
  <div id="toc" class="toc-wrapper">
    <ul>
      <li>
        <a href="#toc.1">
          <span class="toc-item-index">1</span>
          H1-1
        </a>
      </li>
      <ul>
        <li>
          <a href="#toc.1-1">
            <span class="toc-item-index">1.1</span>
            H2-1
          </a>
        </li>
        <ul>
          <li>
            <a href="#toc.1-1-1">
              <span class="toc-item-index">1.1.1</span>
              H3-1
            </a>
          </li>
        </ul>
      </ul>
      <li>
        <a href="#toc.2">
          <span class="toc-item-index">2</span>
          H1-2
        </a>
      </li>
     </ul>
  </div>
</p>

<h1 id="toc.1" class="toc-heading">
  <span class="toc-heading-prefix">1</span>
  <span class="toc-heading-content">H1-1</span>
  <a href="#toc" class="toc-heading-suffix">#</a>
</h1>
<h2 id="toc.1-1" class="toc-heading">
  <span class="toc-heading-prefix">1.1</span>
  <span class="toc-heading-content">H2-1</span>
  <a href="#toc" class="toc-heading-suffix">#</a>
</h2>
<h3 id="toc.1-1-1" class="toc-heading">
  <span class="toc-heading-prefix">1.1.1</span>
  <span class="toc-heading-content">H3-1</span>
  <a href="#toc" class="toc-heading-suffix">#</a>
</h3>
<h1 id="toc.2" class="toc-heading">
  <span class="toc-heading-prefix">2</span>
  <span class="toc-heading-content">H1-2</span>
  <a href="#toc" class="toc-heading-suffix">#</a>
</h1>
```



## Usage

```javascript
const md = require('markdown-it')(mkOpts)
	.use(require('@leisn/markdown-it-toc'),options);
console.log(md.render('[toc]\n# h1\n## h2-1\n## h2-2'));
```

## Options


* **tocRegexp?: RegExp**  Regular expression to detect TOC  (default `/\[toc\]/im`).

* **tocTag?: string**  Tag for toc root element ( `div` by default ).

* **tocAttrs?: string**  Attributes for toc root element( `id="toc" class="toc-wrapper"` by default ).

* **headingAttrs?: string**  Attributes for headings `h1,h2,h3...` ( `class="toc-heading"` by default )

  ```html
  --------------------------
  # h1 title
  --------------------------
  <h1 {headingAttrs}>
  <span>h1 title</span>
  </h1>
  ```

* **headingContentAttrs?: string**  Attributes for headings content `span` ( `class="toc-heading-content"` by default ) 
  ```html
  --------------------------
  # headingContent
  --------------------------
  <h1>
  <span {headingContentAttrs} > headingContent </span>
  </h1>
  ```

* **getToc?(toc: string): boolean** Get toc result, return false if you don't want it show in the result html document, else return true(default `null`).  `toc` : the result html document

* **getPathId?(info): string** Get id content for forwarding in page,  (e.g. for `info.paths=[1,2]` default return `toc-no.1-2` )

* **getTocItemContent?(info): string** Content inside toc item `a` (html, include item heading text)

* **getHeadingPrefix?(info): string** Content inside heading (html, before heading text)

  ```html
  --------------------------
  # h1 title
  --------------------------
  <h1>
  {getHeadingPrefix}
  <span>h1 title</span>
  </h1>
  ```

  

* **getHeadingSuffix?(info): string** Content inside heading (html, after heading text)

  ```html
  --------------------------
  # h1 title
  --------------------------
  <h1>
  <span>h1 title</span>
  {getHeadingSuffix}
  </h1>
  ```

  


## Test

```bash
$ npm run test
or
$ yarn test
```



## LICENSE

MIT