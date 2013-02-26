'use strict';
/*jshint asi: true */

var test       =  require('trap').test
  , styles     =  require('ansistyles')
  , highlight  =  require('cardinal').highlight
  , diff       =  require('difflet')({ indent: 2, comma: 'first'})
  , snippetify =  require('..')

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true)
}

function check(msg, fn, expected, trace) {
  var lines = ('' + fn).split('\n')

  lines.shift()
  lines.pop()

  var code = lines.join('\n')
    , result = snippetify(code)

  // don't include ast or fixed code in comparison
  result = result.map(function (x) { return { start: x.start, end: x.end, raw: x.raw } })

  if (trace) console.log(diff.compare({}, result))

  test(msg + styles.reset('\n') + highlight(code, { linenos: true }), function (t) {
    t.deepEqual(result, expected, styles.reset('\n') + inspect(expected))
  })
}

check(
    'single assignment'
  , function _() {
var a = 3;
    }
  , [{"start":1,"end":1,"raw":"var a = 3;"}]
)

check(
    'two var assignments'
  , function _() {
var a = 3;
var b = 2;
    }
  , [ { "start" : 1
      , "end" : 1
      , "raw" : "var a = 3;" }
    , 
      { "start" : 2
      , "end" : 2
      , "raw" : "var b = 2;" }
    ]
)

check(
    'two var assignments comma first'
  , function _() {
var a = 3
  , b = 2;
    }
  , [ { "start" : 1
      , "end" : 1
      , "raw" : "var a = 3" }
    , 
      { "start" : 2
      , "end" : 2
      , "raw" : "  , b = 2;" }
    ]
)

check(
    'multiline object literal assignment'
  , function _() {
var o = {
  a : 1,
  b : 2,
  c : 3 };
    }
  , [ { "start" : 1
      , "end" : 4
      , "raw" : "var o = {\n  a : 1,\n  b : 2,\n  c : 3 };" }
    ]
)

