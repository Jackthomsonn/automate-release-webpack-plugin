const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')
const package = require(path.resolve('./', 'package.json'))

const AutomateRelease = function() {
}

const getShellScriptPath = function() {
  return __dirname.replace(/ /g, '\\ ') + '/prepare-release.sh'
}

const handleMajor = function() {
  let major = package.version.split('.')[0]
  let version = package.version

  return version.substr(0, 0) + (Number(major) + 1) + '.' + '0.0'
}

const handleMinor = function() {
  let minor = package.version.split('.')[1]
  let version = package.version

  return version.substr(0, 2) + (Number(minor) + 1) + '.' + version.substr(3 + 1)
}

const handlePatch = function() {
  let patch = package.version.split('.')[2]
  let version = package.version

  return version.substr(0, 4) + (Number(patch) + 1) + version.substr(5 + 1)
}

const determineVersion = function(type) {
  switch (type) {
    case 'major':
      return handleMajor()
      break
    case 'minor':
      return handleMinor()
      break
    case 'patch':
      return handlePatch()
      break
  }
}

const prepareRelease = function(version) {
  exec('sh ' + getShellScriptPath() + ' ' + version, function (err, stdout, stderr) {
    if(err) {
      process.stdout.write('Error trying to release project')
    }
  })
}

AutomateRelease.prototype.apply = function(compiler) {
  compiler.plugin('compile', function(params) {
    const args = process.argv.pop()
    const semverType = args
    const version = determineVersion(semverType)

    package.version = version

    fs.writeFileSync('package.json', JSON.stringify(package, null, 2), function(err) {
      if (err) {
        process.stdout.write('Package JSON not found')
      }
    })

    prepareRelease(version)
  })
}

module.exports = AutomateRelease