# markdown-it-toc

Markdown-it plugin to make table of contents, default parse tag [toc].

## Installaton

```bash
$ npm install @leisn/markdown-it-toc
```

## Usage

```javascript
const md = require('markdown-it')(mkOpts)
	.use(require('@leisn/markdown-it-toc'),
         globalOptions,contentOptions,headingOptions);
console.log(md.render('[toc]\n# h1\n## h2-1\n## h2-2'));
```

### globalOptions

>  `globalOptions` will override `contentOptions` and  `headingOptions` 

#### global


* **tocRegexp (RegExp)**  Regular expression to detect TOC in source (default `/\[toc\]/im`)
* **hTopLevel (Number)**  Top heading level for parser (default `1` for `#`)
* **hLowLevel (Number)**  Lowest heading level for parser (default `6` for `######`)
* **anchorNumberIdPrefix (String)**  Prefix for each ID attribute of headings (default `toc-no.`)
* **getToc (Function)**  get \[TOC\] document result in HTML  (default `null` )
	
	> return **true** to still show in HTML document, return `undefined or false` to avoid it.


#### override others
* **anchorClass (String)**  HTML class for entire anchor part (default `undefined`)

* **useAnchorString (Boolean)**  Enable use some symbol before number index and heading (default `undefined`)

* **useAnchorNumber (Boolean)**  Enable use  number index before heading (default `undefined`)

* **anchorSymbol (String)** The symbol use  before number index and heading (default `undefined`)

* **anchorSymbolClass (String)**  HTML class for symbol part (default `undefined`)

* **anchorNumberClass (String)**  HTML class for number index part (default `undefined`)

* **getAnchorNumber (Function)**  Custom number index generator, show in HTML text not in attributes (default `undefined`)

  **param (Array)** Index array of heading. `E.g:` h1 is `[1]`, h2 is `[1,1]`, another h2 is `[1,2]`
  
  > If not set in `lobalOptions` and `contentOptions` or `headingOptions` , it use `[param].join('.') +' '`

### contentOptions

> Only use in table of contents generator  

#### Custom options
* **tocHeader(String)**  Header of TOC, should be full tags. `E.g:<h3>Table of Content</h3>`  (default `''`)
* **tocWrapperId(String)**  HTML ID for TOC Wrapper (default `'toc'`)
* **tocWrapperClass(String)**  HTML class for TOC Wrapper (default `'toc-wrapper'`)
* **tocListClass(String)**  HTML class for TOC list , tag of `ul`  (default `'toc-list'`)
* **tocItemClass(String)**  HTML class for TOC list  item, tag of `li`  (default `'toc-item'`)
* **headingInLink(Boolean)**  Enable the content's link include heading (default `true`)

#### Overrides by globalOptions

> Only use in heading  

* **anchorClass (String)**  HTML class for entire anchor part (default `'toc-content-anchor'`)

* **useAnchorString (Boolean)**  Enable use some symbol before number index and heading (default `false`)

* **useAnchorNumber (Boolean)**  Enable use  number index before heading (default `false`)

* **anchorSymbol (String)** The symbol use  before number index and heading (default `'# '`)

* **anchorSymbolClass (String)**  HTML class for symbol part (default `'toc-content-syl'`)

* **anchorNumberClass (String)**  HTML class for number index part (default `'toc-content-no'`)

* **getAnchorNumber (Function)**  Custom number index generator, show in HTML text not in attributes (default `null`)

  **param (Array)** Index array of heading. `E.g:` h1 is `[1]`, h2 is `[1,1]`, another h2 is `[1,2]`
  
### headingOptions

#### Overrides by globalOptions

* **anchorClass (String)**  HTML class for entire anchor part (default `'toc-heading-anchor'`)

* **useAnchorString (Boolean)**  Enable use some symbol before number index and heading (default `false`)

* **useAnchorNumber (Boolean)**  Enable use  number index before heading (default `false`)

* **anchorSymbol (String)** The symbol use  before number index and heading (default `'§ '`)

* **anchorSymbolClass (String)**  HTML class for symbol part (default `'toc-heading-syl'`)

* **anchorNumberClass (String)**  HTML class for number index part (default `'toc-heading-no'`)

* **getAnchorNumber (Function)**  Custom number index generator, show in HTML text not in attributes (default `null`)

  **param (Array)** Index array of heading. `E.g:` h1 is `[1]`, h2 is `[1,1]`, another h2 is `[1,2]`

## Test

```bash
$ npm run test
```



## LICENSE

MIT