/*jshint asi: true */
var check      =  require('./utils/check')
var test       =  require('trap').test
  , snippetify =  require('..')

check(
    'duplicate key without any strict mode'
  , function _() {
function foo() {
  var o = { a: 1, a: 2 }
}
     }
  , [ {
        "start": 1,
        "end": 3,
        "raw": "function foo() {\n  var o = { a: 1, a: 2 }\n}",
        "code": "function foo() {\n  var o = { a: 1, a: 2 }\n}"
    } ]
  , true
)

test('duplicate key with local strict mode nonstrict: off', function (t) {
  var code = [
      'function foo() {'
    , '  "use strict";'
    , '  var o = { a: 1, a: 2 }'
    , '}'
  ].join('\n');

  t.throws(snippetify.bind(null, code), /unable to snippetify/, 'throws unable to snippetify error')
})

test('duplicate key with local strict mode nonstrict: on', function (t) {
  var code = [
      'function foo() {'
    , '  "use strict";'
    , '  var o = { a: 1, a: 2 }'
    , '}'
  ].join('\n');


  var snippets = snippetify(code, { nonstrict: true });
  delete snippets[0].ast;

  t.deepEqual(
      snippets
    , [ { start: 1,
        end: 4,
        code: 'function foo() {\n  "use strict";\n  var o = { a: 1, a: 2 }\n}',
        raw: 'function foo() {\n  "use strict";\n  var o = { a: 1, a: 2 }\n}' }]
    , 'returns snippet including use strict statement in code and raw'
  )
})
