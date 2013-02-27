'use strict';
var fs         =  require('fs')
  , util       =  require('util')
  , snippetify =  require('..')
  , code       =  fs.readFileSync(__filename, 'utf-8')
  , snippets   =  snippetify(code);

function printAst(snippets) {
  var lines = snippets
    .map(function (x) { return util.inspect(x.ast, 0, 5, true); });

  console.log(lines.join('\n'));
}

printAst(snippets);
