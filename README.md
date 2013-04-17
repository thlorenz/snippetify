# snippetify [![build status](https://secure.travis-ci.org/thlorenz/snippetify.png)](http://next.travis-ci.org/thlorenz/snippetify)

Splits a given JavaScript file into as many parsable snippets as possible.

## Example

```js
'use strict';
var fs         =  require('fs')
  , snippetify =  require('..')
  , code       =  fs.readFileSync(__filename, 'utf-8')
  , snippets   =  snippetify(code);

function printRawCode(snippets) {
  // prints all lines exactly as they appeared in the script
  var lines = snippets
    .map(function (x) { return '[ ' + x.raw + ' ]'; });

  console.log(lines.join('\n'));
}

printRawCode(snippets);
```

Outputs:

```js
[ 'use strict'; ]
[ var fs         =  require('fs') ]
[   , snippetify =  require('..') ]
[   , code       =  fs.readFileSync(__filename, 'utf-8') ]
[   , snippets   =  snippetify(code); ]
[  ]
[ function printRawCode(snippets) {
  // prints all lines exactly as they appeared in the script
  var lines = snippets
    .map(function (x) { return '[ ' + x.raw + ' ]'; });

  console.log(lines.join('\n'));
} ]
[  ]
[ printRawCode(snippets); ]
[  ]
```

## API

```js
snippetify(script[, esprimaOpts])
```

```
/**
 * Splits given script into as many root level snippets as possible, one line being the smallest possible.
 * Keeps root level expressions intact, i.e. does not pull out snippets from inside functions.
 * 
 * @name snippetify
 * @function
 * @param script {String} The script to split into snippets.
 * @param opts {Object} Options, most of which will be passed to the esprima parser (optional):
 *    loc      :  Nodes have line and column-based location info
 *    range    :  Nodes have an index-based location range (array)
 *    raw      :  Literals have extra property which stores the verbatim source
 *    tokens   :  An extra array containing all found tokens
 *    comment  :  An extra array containing all line and block comments
 *    tolerant :  An extra array containing all errors found, attempts to continue parsing when an error is encountered
 *  -- Non esprima opts:
 *    nonstrict:  Removes 'use strict' directives during parse to prevent esprima parser from throwing errors due to use strict violations
 * @return {Array{Object}} each with the following properties:
 *    code     :  The snippet code that was parsed and possibly fixed
 *    raw      :  The snippet code that was parsed before it was fixed
 *    ast      :  The AST for the snippet (note ast.tokens will be present if tokens: true is set)
 */
```

## More Examples

Find more examples [here](https://github.com/thlorenz/snippetify/tree/master/examples)
