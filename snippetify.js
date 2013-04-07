'use strict';

var parse = require('esprima').parse
  , commaFirstAssignment = /^[\t ]*,[\t ]*\S+[\t ]*=[\t ]*\S+/;

function fix(line) {
  var fixed = line;

  if (commaFirstAssignment.test(line)) {
    var idx = line.indexOf(',');
    fixed = 'var' + fixed.slice(0, idx).trim() + ' ' + fixed.slice(idx + 1).trim();
  }

  return fixed;
}

/**
 * Splits given script into as many root level snippets as possible, one line being the smallest possible.
 * Keeps root level expressions intact, i.e. does not pull out snippets from inside functions.
 * 
 * @name snippetify
 * @function
 * @param script {String} The script to split into snippets.
 * @param esprimaOpts {Object} Options to pass to the esprima parser (optional):
 *    loc      :  Nodes have line and column-based location info
 *    range    :  Nodes have an index-based location range (array)
 *    raw      :  Literals have extra property which stores the verbatim source
 *    tokens   :  An extra array containing all found tokens
 *    comment  :  An extra array containing all line and block comments
 *    tolerant :  An extra array containing all errors found, attempts to continue parsing when an error is encountered
 * @return {Array{Object}} each with the following properties:
 *    code     :  The snippet code that was parsed and possibly fixed
 *    raw      :  The snippet code that was parsed before it was fixed
 *    ast      :  The AST for the snippet (note ast.tokens will be present if tokens: true is set)
 */
module.exports = function snippetify(script, esprimaOpts) {
  var snippets = []
    , lines = script.split('\n');

  if (!lines.length) return [];

  function nextChunk(code, raw) {
    var singleLine =  code.length ===  0
      , line       =  lines[lineno] 
      , fixed      =  fix(line);

    raw = line + raw;
    code = fixed + code;

    try {
      return { code: code, raw: raw, ast: parse(code, esprimaOpts) };
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
