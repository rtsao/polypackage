# polypackage

Generate a CommonJS package from an ES Module package.

An implementation of this idea: https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#poly-packages

## Differences from the proposal
This utility is designed for packages with some build step where `src/` is transpiled into `dist/`.

This utility enforces some restictions on your main `index.js` module so that there's a bijective mapping of named exports to CommonJS submodule files at the root. NOTE: These restrictions apply **only** to the main `index.js`.
- It must only contain named export declarations (no other kinds of statements or declarations)
- Default exports are not allowed (you must give them a name)
- No `export *`

With the exception of these restrictions on the contents of `src/index.js`, there's no other restrictions (e.g. file structure or naming) as the file structure of `dist/` prevents file name collisions. It's designed to work with [Rollup](https://github.com/rollup/rollup) so you can have also have a single bundled ES2015 module in `dist/` in addition to the CommonJS modules.

## Example

https://github.com/rtsao/polypackage/tree/master/packages/demo

**Output:**
- dist/
  - package.json - *(`main` points to `lib/index.js` and `module` points to `es/index.js`)*
  - foo.js
  - bar.js
  - hello.js
  - external.js
  - something-else.js
  - lib/
    - index.js
    - foo.js
    - bar.js
  - es/
    - index.js - *(Rolled up ES Module)*

Now consumers of your package can do both:
```js
import {foo, somethingElse} from 'my-package';
```

```js
// Notice no `.default` is needed
var foo = require('my-package/foo');
var somethingElse = require('my-package/something-else');
```
