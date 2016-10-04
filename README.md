# polypackage
[![build status][build-badge]][build-href]
[![npm version][npm-badge]][npm-href]

**npm packages done right.** Use ES2015+ in your package source and get single npm package optimized for both ES Module and CommonJS consumers, including Weback, Browserify, Rollup, and Node.js. Includes progressive enhancements for tree-shaking bundlers (e.g. Webpack 2 and Rollup).

### Features
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

## What it looks like

#### src/index.js
```js
export {default as foo} from './foo';
export {bar, baz} from './other/submodule';
```

Now consumers of your package can do any of the following:

#### CommonJS (idiomatic submodules)
No referencing `lib/` or `dist/`! No `.default` is needed!
```js
const foo = require('my-package/foo');
const bar = require('my-package/bar');
```

#### CommonJS (entire module)
No `.default` is needed!
```js
const {foo, bar, baz} = require('my-package');
```

#### ES Modules (idiomatic destructuring imports)
With a tree-shaking bundler, you can do this without a potential bundle size penalty. Additionally, because the bundler will resolve a Rolled-up ES module, there's even [less module overhead](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/)!
```js
import {foo, bar} from 'my-package';
```

#### ES Modules (CommonJS-style submodule imports)
Without a tree-shaking bundler, this might be preferred
```js
import foo from 'my-package/foo';
import bar from 'my-package/bar';
```

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



[build-badge]: https://travis-ci.org/rtsao/polypackage.svg?branch=master
[build-href]: https://travis-ci.org/rtsao/polypackage
[npm-badge]: https://badge.fury.io/js/polypackage-core.svg
[npm-href]: https://www.npmjs.com/package/polypackage-core
