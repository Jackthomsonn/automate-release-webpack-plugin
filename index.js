const pkg = require('./package.json')
const fs = require('fs')
const exec = require('child_process').exec

const AutomateRelease = function(options) {
}

const handleMajor = function() {
  let major = pkg.version.split('.')[0]
  let version = pkg.version

  return version.substr(0, 0) + (Number(major) + 1) + '.' + '0.0'
}

const handleMinor = function() {
  let minor = pkg.version.split('.')[1]
  let version = pkg.version

  return version.substr(0, 2) + (Number(minor) + 1) + '.' + version.substr(3 + 1)
}

const handlePatch = function() {
  let patch = pkg.version.split('.')[2]
  let version = pkg.version

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
  exec('sh prepare-release.sh ' + version, function (err, stdout, stderr) {
    if (err != null) {
      return
    } else if (typeof (stderr) != "string") {
      console.log(stderr)
    } else {
      console.log(stdout)
    }
  })
}

AutomateRelease.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(params) {
    const args = process.argv.pop()
    const semverType = args
    const version = determineVersion(semverType)

    pkg.version = version

    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), function(err) {
      if (err) {
        console.log(err)
      }
    })

    prepareRelease(version)
  })
}

module.exports = AutomateRelease