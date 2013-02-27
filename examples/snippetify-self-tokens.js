'use strict';
var fs         =  require('fs')
  , util       =  require('util')
  , snippetify =  require('..')
  , code       =  fs.readFileSync(__filename, 'utf-8')
  
  // Tell esprima's to include tokens when parsing
  , snippets   =  snippetify(code, { tokens: true });

function printTokens(snippets) {
  var lines = snippets
    .map(function (x) { return util.inspect(x.ast.tokens, 0, 5, true) + '\n'; });

  console.log(lines.join('\n'));
}

printTokens(snippets);
