'use strict';
var fs         =  require('fs')
  , snippetify =  require('..')
  , code       =  fs.readFileSync(__filename, 'utf-8')
  , snippets   =  snippetify(code);

// This meaningless comment will be a separate snippet since it is parsable on its own
function printRawCode(snippets) {
  // prints all lines exactly as they appeared in the script
  var lines = snippets
    .map(function (x) { return '[ ' + x.raw + ' ]'; });

  console.log(lines.join('\n'));
}

printRawCode(snippets);
