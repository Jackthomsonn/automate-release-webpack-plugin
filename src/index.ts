import * as fs from 'fs'
import * as child_process from 'child_process'
import * as path from 'path'

import { Compiler } from 'webpack'
import { PrepareRelease } from './prepare-release'

class AutomateRelease {
  private pkg: any
  private semverTypes: Array<string>

  constructor() {
    this.pkg = require(path.resolve('./', 'package.json'))
    this.semverTypes = ['major', 'minor', 'patch']
  }

  public apply = (compiler: Compiler) => {
    compiler.plugin('done', () => {
      console.log(this.updateVersionNumber(this.findType().toString()))
      this.pkg.version = this.updateVersionNumber(this.findType().toString())

      fs.writeFileSync('package.json', this.parsePackageJson())

      new PrepareRelease(this.pkg)
    })
  }

  private getVersionNumberToUpdate = (index: number) => {
    return this.pkg.version.split('.')[index]
  }

  private handleMajor = () => {
    return this.pkg.version.substr(0, 0) + (Number(this.getVersionNumberToUpdate(0)) + 1) + '.' + '0.0'
  }

  private handleMinor = () => {
    return this.pkg.version.substr(0, 2) + (Number(this.getVersionNumberToUpdate(1)) + 1) + '.' + this.pkg.version.substr(3 + 1)
  }

  private handlePatch = () => {
    return this.pkg.version.substr(0, 4) + (Number(this.getVersionNumberToUpdate(2)) + 1) + this.pkg.version.substr(5 + 1)
  }

  private updateVersionNumber = (type: string) => {
    let semverType

    switch (type) {
      case 'major':
        semverType = this.handleMajor()
        break
      case 'minor':
        semverType = this.handleMinor()
        break
      case 'patch':
        semverType = this.handlePatch()
        break
    }

    return semverType
  }

  private findType = () => {
    return this.semverTypes.filter((element) => {
      return (<any>process).argv.includes(element)
    })
  }

  private parsePackageJson = () => {
    return JSON.stringify(this.pkg, null, 2)
  }
}

export { AutomateRelease }