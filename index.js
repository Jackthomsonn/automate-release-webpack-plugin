const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')
const package = require(path.resolve(__dirname, 'package.json'))
const semverTypes = ['major', 'minor', 'patch']

console.log(package)

const handleError = function (error) {
  process.stdout.write('Automate Release Webpack Plugin Error: ', error)
}

const AutomateRelease = function () {
}

const getVersionNumberToUpdate = function (index) {
  return package.version.split('.')[index]
}

const getShellScriptPath = function () {
  return __dirname.replace(/ /g, '\\ ') + '/prepare-release.sh'
}

const handleMajor = function () {
  return package.version.substr(0, 0) + (Number(getVersionNumberToUpdate(0)) + 1) + '.' + '0.0'
}

const handleMinor = function () {
  return package.version.substr(0, 2) + (Number(getVersionNumberToUpdate(1)) + 1) + '.' + package.version.substr(3 + 1)
}

const handlePatch = function () {
  return package.version.substr(0, 4) + (Number(getVersionNumberToUpdate(2)) + 1) + package.version.substr(5 + 1)
}

const updateVersionNumber = function (type) {
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

const prepareRelease = function () {
  exec('sh ' + getShellScriptPath() + ' ' + package.version, function (err, stdout, stderr) {
    if (!err) {
      return
    }

    handleError(err)
  })
}

const findType = function () {
  return semverTypes.filter(function (element) {
    return process.argv.includes(element)
  })
}

const parsePackageJson = function () {
  return JSON.stringify(package, null, 2)
}

AutomateRelease.prototype.apply = function (compiler) {
  compiler.plugin('done', function () {

    package.version = updateVersionNumber(findType().toString())

    fs.writeFileSync('package.json', parsePackageJson())

    prepareRelease()
  })
}

module.exports = AutomateRelease
