'use strict';
/*jshint asi: true */

var test = require('trap').test
  , highlight = require('cardinal').highlight
  , diff = require('difflet')({ indent: 2, comma: 'first'})
  , snippetify = require('..')

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true)
}

function check(msg, fn, expected, trace) {
  var lines = ('' + fn).split('\n')

  lines.shift()
  lines.pop()

  var code = lines.join('\n')
    , result = snippetify(code)

  if (trace) console.log(diff.compare({}, result))

  test('snippetifying', function (t) {
    t.deepEqual(result, expected, '\n' + highlight(code, { linenos: true }) + '\n' + inspect(expected))
  })
}

check(
    'single assignment'
  , function _() {
var a = 3;
    }
  , [{"start":1,"end":1,"code":"var a = 3;"}]
)

check(
    'two var assignments'
  , function _() {
var a = 3;
var b = 2;
    }
  , [ 
      { "start" : 1
      , "end" : 1
      , "code" : "var a = 3;" }
    , 
      { "start" : 2
      , "end" : 2
      , "code" : "var b = 2;" }
    ]
)
