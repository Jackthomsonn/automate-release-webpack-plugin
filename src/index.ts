import * as fs from 'fs'
import * as path from 'path'

import { Compiler } from 'webpack'
import { PrepareRelease } from './prepare-release'
import { HandleMajor } from './handlers/handle-major'
import { HandleMinor } from './handlers/handle-minor'
import { HandlePatch } from './handlers/handle-patch'

class AutomateRelease {
  private pkg: any
  private semverTypes: Array<string>

  constructor() {
    this.pkg = require(path.resolve('./', 'package.json'))
    this.semverTypes = ['major', 'minor', 'patch']
  }

  public apply = (compiler: Compiler) => {
    compiler.plugin('done', () => {
      this.pkg.version = this.updateVersionNumber(this.findType().toString())

      fs.writeFileSync('package.json', this.parsePackageJson())

      new PrepareRelease(this.pkg)
    })
  }

  private updateVersionNumber = (type: string) => {
    let semverType

    switch (type) {
      case 'major':
        semverType = new HandleMajor(this.pkg)
        break
      case 'minor':
        semverType = new HandleMinor(this.pkg)
        break
      case 'patch':
        semverType = new HandlePatch(this.pkg)
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