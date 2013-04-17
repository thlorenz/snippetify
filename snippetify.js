'use strict';

var parse = require('esprima').parse
  , commaFirstAssignment = /^[\t ]*,[\t ]*\S+[\t ]*=[\t ]*\S+/
  , useStrict = /^ *['"]use strict['"][; ]*$/
  , nonStrict = '// *** non strict snippetify fix +++***+++&&&'
  ;

function fix(line, hideStrict) {
  var fixed = line;

  if (commaFirstAssignment.test(line)) {
    var idx = line.indexOf(',');
    fixed = 'var' + fixed.slice(0, idx).trim() + ' ' + fixed.slice(idx + 1).trim();
  }

  if (hideStrict && useStrict.test(line)) {
    fixed = nonStrict + line;
  }

  return fixed;
}

function unfix(code, hideStrict) {
  // some fixes should be undone even in the adapted code
  if (hideStrict) code = code.replace(nonStrict, '');

  return code;
}

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
var snippetify = module.exports = function (script, opts) {
  opts = opts || {};
  var snippets = []
    , lines = script.split('\n');

  if (!lines.length) return [];

  function nextChunk(code, raw) {
    var singleLine =  code.length ===  0
      , line       =  lines[lineno] 
      , fixed      =  fix(line, opts.nonstrict);

    raw = line + raw;
    code = fixed + code;

    try {
      var ast = parse(code, opts);
      code = unfix(code, opts.nonstrict);

      return { code: code, raw: raw, ast: ast };
    } catch(e) {
      if (--lineno === -1) {
        var err = new Error('unable to snippetify ' + code);
        err.inner = e;
        throw err;
      }
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

var code = 
    'function foo() {\n"use strict";\n  var o = { a: 1, a: 2 };\n}\n\n;'
  + 'function bar() {\n\'use strict\';\n  var o = { a: 1, a: 2 };\n}';
snippetify(code, { nonstrict: true });
