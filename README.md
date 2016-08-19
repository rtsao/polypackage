# polypackage

Generate a CommonJS module from an ES Module.

An implementation of this: https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#poly-packages

## Differences from the proposal
This utility is designed for packages with some build step where `src/` is transpiled into `dist/`.

This utility enforces some restictions on your main `module.js` so that there's a bijective mapping of named exports to CommonJS submodule files at the root. NOTE: These restrictions apply **only** to the main `module.js`.
- It must only contain named export declarations (no other kinds of statements or declarations)
- Default exports are not allowed (you must give them a name)
- No `export *`

With the exception of these restrictions on the contents of `src/module.js`, there's no other restrictions (e.g. file structure or naming) as the file structure of `dist/` prevents file name collisions. It's designed to work with [Rollup](https://github.com/rollup/rollup) so you can have also have a single bundled ES2015 module in `dist/` in addition to the CommonJS modules.

## Example

**src/module.js**
```js
export {foo} from './foo';
export {default as bar, hello} from './bar';
export {default as external, other as somethingElse} from 'external-module';
```
**Output:**
- dist/
  - package.json (`"main": "lib/module.js"`)
  - foo.js
  - bar.js
  - hello.js
  - external.js
  - somethingElse.js
  - lib/
    - module.js
    - foo.js
    - bar.js

Now you can do:
```js
var foo = require('my-package/foo');
```

And if you also output a `src/module.js` a Rollup bundle in `dist` and add it to the `dist/package.json` `"module"` field, you can do:

```js
import {foo} from 'my-package';
```
