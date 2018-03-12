import * as fs from 'fs'
import * as path from 'path'

import chalk from 'chalk';
import { compilation } from 'webpack'
import { ErrorHandler } from './error'
import { HandleMajor } from './handlers/handle-major'
import { HandleMinor } from './handlers/handle-minor'
import { HandlePatch } from './handlers/handle-patch'
import { PrepareRelease } from './prepare-release'

class AutomateRelease {
  private pkg: any
  private semverTypes: Array<string>
  private options: AutomateReleasePlugin.IOptions

  constructor(options: AutomateReleasePlugin.IOptions) {
    this.options = this.populateDefaultOptionsConfig(options)
    this.pkg = require(path.resolve('./', 'package.json'))
    this.semverTypes = ['major', 'minor', 'patch']

    if (this.options.preReleaseLabel && !this.options.preReleaseLabel.includes('-')) {
      this.constructReleaseLabel()
    }
  }

  public apply = (compiler: any): void => {
    compiler.plugin('emit', (comp: compilation.Compilation) => {
      if (comp.errors.length === 0) {
        try {
          this.checkReleaseLabelIsPresentInPackageJson()
          this.checkLabelIsPresentInConfig()

          this.startAutomation()
        } catch (err) {
          ErrorHandler.handle(err)
        }
      } else {
        // tslint:disable-next-line:no-console
        comp.errors.forEach(error => console.log(error.message))
      }
    })
  }

  private populateDefaultOptionsConfig(options: AutomateReleasePlugin.IOptions): AutomateReleasePlugin.IOptions {
    return { preReleaseLabel: undefined, ...options };
  }

  private checkReleaseLabelIsPresentInPackageJson(): void {
    if (this.options.preReleaseLabel && !this.pkg.version.includes(this.options.preReleaseLabel)) {
      throw ({
        // tslint:disable-next-line:max-line-length
        message: `preReleaseLabel is missing or does not match what you have specified in the config. Add '${this.options.preReleaseLabel}' to your package.json or remove the preReleaseLabel from the config`
      })
    }
  }

  private checkLabelIsPresentInConfig(): void {
    if (!this.options.preReleaseLabel && this.pkg.version.includes('-')) {
      throw ({
        // tslint:disable-next-line:max-line-length
        message: `preReleaseLabel is present in your package json but not set in the config. Remove '${this.pkg.version.split('-').pop()}' or set the preReleaseLabel in the options config to '${this.pkg.version.split('-').pop()}'`
      })
    }
  }

  private handleLabeledRelease() {
    this.pkg.version = this.pkg.version.replace(this.options.preReleaseLabel, '')

    const cacheVersion = this.pkg.version

    fs.writeFileSync('package.json', this.parsePackageJson())

    new PrepareRelease(this.pkg, this.options, () => {
      this.pkg.version = this.updateVersionNumber(this.findType().toString())

      this.addPreReleaseLabel()

      fs.writeFileSync('package.json', this.parsePackageJson())

      // tslint:disable-next-line:no-console
      console.log(
        chalk.bold.magentaBright(
          'Automate Release Webpack Plugin:'), chalk.italic.blue(
            `Successfully released version ${cacheVersion}`
          )
      )
    });
  }

  private handleNonLabledRelease() {
    this.pkg.version = this.updateVersionNumber(this.findType().toString())

    fs.writeFileSync('package.json', this.parsePackageJson())

    new PrepareRelease(this.pkg, this.options, () => {
      // tslint:disable-next-line:no-console
      console.log(
        chalk.bold.magentaBright(
          'Automate Release Webpack Plugin:'), chalk.italic.blue(
            `Successfully released version ${this.pkg.version}`
          )
      )
    })
  }

  private startAutomation(): void {
    if (this.options.preReleaseLabel) {
      this.handleLabeledRelease()
    } else {
      this.handleNonLabledRelease()
    }
  }

  private constructReleaseLabel(): void {
    this.options.preReleaseLabel = '-' + this.options.preReleaseLabel
  }

  private updateVersionNumber = (type: string) => {
    if (this.options.preReleaseLabel) {
      this.removePreReleaseLabel()
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
      return (process as any).argv.includes(element)
    })
  }

  private parsePackageJson = (): string => {
    return JSON.stringify(this.pkg, null, 2)
  }

  private removePreReleaseLabel(): void {
    this.pkg.version = this.pkg.version.replace(this.options.preReleaseLabel, '')
  }

  private addPreReleaseLabel(): void {
    this.pkg.version = this.pkg.version + this.options.preReleaseLabel
  }
}

export { AutomateRelease }