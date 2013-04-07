'use strict';
/*jshint asi: true */

var test       =  require('trap').test
  , styles     =  require('ansistyles')
  , highlight  =  require('cardinal').highlight
  , diff       =  require('difflet')({ indent: 2, comma: 'first'})
  , snippetify =  require('../..')

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true)
}

module.exports = function check(msg, fn, expected, includeCode) {
  var lines = ('' + fn).split('\n')

  lines.shift()
  lines.pop()

  var code = lines.join('\n')
    , result = snippetify(code)

  // don't include ast or fixed code in comparison
  result = result.map(function (x) { 
    var o = { start: x.start, end: x.end, raw: x.raw } 
    if (includeCode) o.code = x.code;
    return o;
  })

  if (!expected) console.log(diff.compare({}, result))

  test(msg + styles.reset('\n') + highlight(code, { linenos: true }), function (t) {
    t.deepEqual(result, expected, styles.reset('\n') + inspect(expected))
  })
}
