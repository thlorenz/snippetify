'use strict';
var fs         =  require('fs')
  , snippetify =  require('..')
  , code       =  fs.readFileSync(__filename, 'utf-8')
  , snippets   =  snippetify(code);

// This meaningless comment will be a separate snippet since it is parsable on its own
function printParsableCode(snippets) {
  // prints all lines, some of which were fixed to make them parsable
  var lines = snippets
    .map(function (x) { return '[ ' + x.code + ' ]'; });

  console.log(lines.join('\n'));
}

printParsableCode(snippets);
