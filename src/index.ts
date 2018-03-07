import * as fs from 'fs'
import * as path from 'path'

import { Compiler } from 'webpack'
import { PrepareRelease } from './prepare-release'
import { HandleMajor } from './handlers/handle-major'
import { HandleMinor } from './handlers/handle-minor'
import { HandlePatch } from './handlers/handle-patch'

class AutomateRelease {
  protected pkg: any
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

  private updateVersionNumber = (type: string): any => {
    switch (type) {
      case 'major':
        return new HandleMajor(this.pkg).handleVersion()
      case 'minor':
        return new HandleMinor(this.pkg).handleVersion()
      case 'patch':
        return new HandlePatch(this.pkg).handleVersion()
    }
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