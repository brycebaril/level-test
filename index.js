var levelup = require('levelup')
var Memdown = require('memdown') 
var rimraf = require('rimraf')
var tmpdir = require('osenv').tmpdir()
var path = require('path')
var xtend = require('xtend')
function disk (opts) {
  var leveldown = require('leveldown')
  return function (name, _opts, cb) {
    _opts = xtend(opts, _opts)
    name = name || 'db_' + Date.now()
    var dir = path.join(tmpdir, name)
    if(opts.clean !== false)
      rimraf.sync(dir)
    _opts.db = leveldown
    return levelup(dir, _opts, cb)
  }
}

function mem (name, _opts, cb) {
  _opts = _opts || {}
  _opts.db = function (l) { return new Memdown(l) }
  name = name || 'in-memory'
  return levelup(name, _opts, cb)
}


module.exports = function (opts) {
  opts = opts || {}
  return opts.mem ? mem : disk(opts)
}

