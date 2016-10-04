# polypackage

[![build status][build-badge]][build-href]
[![npm version][npm-badge]][npm-href]

Use ES2015+ import/export syntax to publish a single npm package with:
* Universal granular imports for consumers lacking a tree-shaking bundler
 * **Idiomatic CommonJS consumption**
    * No `require('my-package').default`
    * Consumption of individual submodules **without exposing transpilation paths**
      * `require('my-package/submodule')` rather than `require('my-package/lib/submodule)`
 * Granular ES2015+ consumption of submodules akin to CommonJS when not using a tree-shaking bundler
      * `import submodule from 'my-package/submodule'` without tree shaking
 * Future-proof idiomatic ES2015+ consumption via destructured imports, i.e. `import {submodule} from 'my-package'`
* **Progressive enhacement for consumers using a tree-shaking bundler** via a 
 * Rolled-up "module" entry file enables use of idiomatic ES2015+ consumption via destructured imports with less module overhead
* **Support for `npm link` and Lerna**

Polypackage is loosely based on the "poly-packages" idea proposed in https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#poly-packages

## How it works

1. Create a polypackage "index" entry with ES2015 export syntax.
 - This file must conform to the following format:
    - Must only contain named export declarations (no other kind of statements are allowed)
    - All exports must be named (no default exports) and have a source
 - This ensures a bijective mapping between named exports and CommonJS submodules
2. Set the package.json "main" field to `dist/index.js` and "module" field to `dist-es/index.js`
3. Add `/*.js` to your gitignore, which ignores the generated files at your package root
4. A CommonJS submodule entry will be created at the root for any named export

#### Package structure:

* package.json - (`"main": "dist/index.js"` and `"module": "dist-es/index.js"`)
* .gitignore - (`dist/`, `dist-es/`, `/*.js`)
* .npmignore - (`src/`, `.*`)
* src/
  * index.js
  * foo.js
  * other/
    * bar.js

#### Resulting polypackage:

* **foo.js**
* **bar.js**
* *package.json*
* *.gitignore*
* *.npmignore*
* **dist/**
  * **index.js**
  * **other/**
    * **bar.js**
* **dist-es/**
  * **index.js** - *(Rolled up ES Module)*
* *src/*
  * *index.js*
  * *foo.js*
  * *other/*
    * *bar.js*

Now consumers of your package can do both:
```js
import {foo, bar} from 'my-package';
```

and

```js
// Notice no `.default` is needed
var foo = require('my-package/foo');
var bar = require('my-package/bar');
```

[build-badge]: https://travis-ci.org/rtsao/polypackage.svg?branch=master
[build-href]: https://travis-ci.org/rtsao/polypackage
[npm-badge]: https://badge.fury.io/js/polypackage-core.svg
[npm-href]: https://www.npmjs.com/package/polypackage-core
