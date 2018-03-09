import * as fs from 'fs'
import * as path from 'path'

import { Compiler } from 'webpack'
import { PrepareRelease } from './prepare-release'
import { HandleMajor } from './handlers/handle-major'
import { HandleMinor } from './handlers/handle-minor'
import { HandlePatch } from './handlers/handle-patch'
import { ErrorHandler } from './error'

class AutomateRelease {
  protected pkg: any
  private semverTypes: Array<string>
  private options: AutomateReleasePlugin.IOptions

  constructor(options: AutomateReleasePlugin.IOptions) {
    this.options = Object.assign({ releaseLabel: undefined }, options)
    this.pkg = require(path.resolve('./', 'package.json'))
    this.semverTypes = ['major', 'minor', 'patch']

    if (this.options.releaseLabel && !this.options.releaseLabel.includes('-')) {
      this.constructReleaseLabel()
    }
  }

  public apply = (compiler: Compiler): void => {
    compiler.plugin('done', () => {

      try {
        this.checkReleaseLabelIsPresentInPackageJson()
        this.checkLabelIsPresentInConfig()

        this.startAutomation()
      } catch (err) {
        ErrorHandler.handle(err)
      }
    })
  }

  private checkReleaseLabelIsPresentInPackageJson(): void {
    if (this.options.releaseLabel && !this.pkg.version.includes(this.options.releaseLabel)) {
      throw ({ message: `Release label is missing or does not match what you have specified in the config. Add '${this.options.releaseLabel}' to your package.json or remove the releaselabel from the config` })
    }
  }

  private checkLabelIsPresentInConfig(): void {
    if (!this.options.releaseLabel && this.pkg.version.includes('-')) {
      throw ({ message: `Release label is present in your package json but not set in the config. Remove '${this.pkg.version.split('-').pop()}' or set releaseLabel in the options config to '${this.pkg.version.split('-').pop()}'` })
    }
  }

  private startAutomation(): void {
    new PrepareRelease(this.pkg, this.options)

    this.pkg.version = this.updateVersionNumber(this.findType().toString())

    if (this.options.releaseLabel) {
      this.addReleaseLabel()
    }

    fs.writeFileSync('package.json', this.parsePackageJson())
  }

  private constructReleaseLabel(): void {
    this.options.releaseLabel = '-' + this.options.releaseLabel
  }

  private updateVersionNumber = (type: string) => {
    if (this.options.releaseLabel) {
      this.removeReleaseLabel()
    }

    switch (type) {
      case 'major':
        return new HandleMajor(this.pkg).handleVersion()
      case 'minor':
        return new HandleMinor(this.pkg).handleVersion()
      case 'patch':
        return new HandlePatch(this.pkg).handleVersion()
    }
  }

  private findType = (): Array<string> => {
    return this.semverTypes.filter((element) => {
      return (<any>process).argv.includes(element)
    })
  }

  private parsePackageJson = (): string => {
    return JSON.stringify(this.pkg, null, 2)
  }

  private removeReleaseLabel(): void {
    this.pkg.version = this.pkg.version.replace(this.options.releaseLabel, '')
  }

  private addReleaseLabel(): void {
    this.pkg.version = this.pkg.version + this.options.releaseLabel
  }
}

export { AutomateRelease }