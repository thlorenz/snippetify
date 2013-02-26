'use strict';

var parse = require('esprima').parse
  , commaFirstAssignment = /^[\t ]*,[\t ]*\S[\t ]*=[\t ]*\S+/;

function singleLineFix(line) {
  var fixed = line;

  if (commaFirstAssignment.test(line)) {
    var idx = line.indexOf(',');
    fixed = fixed.slice(0, idx) + ' ' + fixed.slice(idx + 1);
  }

  return fixed;
}

var s = module.exports = function snippetify(script) {
  var snippets = []
    , lines = script.split('\n');

  if (!lines.length) return [];

  function nextChunk(code, raw) {
    var singleLine =  code.length ===  0
      , line       =  lines[lineno] 
      , fixed      =  singleLine ? singleLineFix(line) : line;

    raw = line + raw;
    code = fixed + code;

    try {
      return { code: code, raw: raw, ast: parse(code) };
    } catch(e) {
      if (--lineno === -1) throw new Error('unable to snippetify ' + code);
      return nextChunk('\n' + code, '\n' + raw);
    }
  }

  var lineno = lines.length;

  while (--lineno > -1) {
    var snippetEnd = lineno +1
      , snippet = nextChunk('', '')
      , snippetStart = lineno + 1;

    snippets.unshift({
        start :  snippetStart
      , end   :  snippetEnd
      , code  :  snippet.code
      , raw   :  snippet.raw
      , ast   :  snippet.ast
    });
  }

  return snippets;
};

/*console.log(
  s('var o = {\n    a: 1\n  , b: 2  , c: 3} ')
);*/
