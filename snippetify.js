'use strict';

var parse = require('esprima').parse;

module.exports = function snippetify(script) {
  var snippets = []
    , lines = script.split('\n')
    , lineno = 0;

  function nextChunk(code) {
    lineno++;
    var nextLine = lines.shift();

    code = code + nextLine;
    try {
      parse(code);
      return code;
    } catch(e) {
      return nextChunk(code + '\n');
    }
  }

  while (lines && lines.length) {
    var snippetStart = lineno + 1
      , snippet = nextChunk('');

    snippets.push({ start: snippetStart, end: lineno, code: snippet });
  }
  return snippets;
};
