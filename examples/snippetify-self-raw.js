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
