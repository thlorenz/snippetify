'use strict';
/*jshint asi: true */
var check = require('./utils/check')

check(
    'single line function declaration'
  , function _() {
function foo() { console.log('hello'); }
    }
  , [ { "start" : 1
      , "end" : 1
      , "raw" : "function foo() { console.log('hello'); }" }
    ]
)

check(
    'multi line function declaration'
  , function _() {
function foo() {
  console.log('hello');
}
    }
  , [ { "start" : 1
      , "end" : 3
      , "raw" : "function foo() {\n  console.log('hello');\n}" }
    ]
)

check(
    'single line function assignment'
  , function _() {
var foo = function () { console.log('hello'); }
    }
  , [ { "start" : 1
      , "end" : 1
      , "raw" : "var foo = function () { console.log('hello'); }" }
    ]
)

check(
    'multi line function assignment'
  , function _() {
var foo = function () {
  console.log('hello');
}
    }
  , [ { "start" : 1
      , "end" : 3
      , "raw" : "var foo = function () {\n  console.log('hello');\n}" }
    ]
)

check(
    'multi line function assignment comma first'
  , function _() {
var a = 1
  , foo = function () {
      console.log('hello');
    }
    }
  , [ { "start" : 1
      , "end" : 1
      , "raw" : "var a = 1" },
      {  "start" : 2
      , "end" : 4
      , "raw": "  , foo = function () {\n      console.log('hello');\n    }" }
    ]
)
