# polypackage

Generate a CommonJS module from an ES Module.

An implementation of this: https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#poly-packages

This utility enforces some restictions on your `main: module.js` so that compatibility with CommonJS is maximized. These restrictions apply *only* to the root `module.js`.
- It must only contain named export declarations (no other kinds of statements or declarations)
- Default exports are not allow (you must give them a name)
- No `export *` 

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
