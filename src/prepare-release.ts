import { exec } from 'child_process'
import { ErrorHandler } from './error'

class PrepareRelease {
  private pkg: any
  private options: AutomateReleasePlugin.IOptions

  constructor(pkg: any, options: AutomateReleasePlugin.IOptions, callback: () => void) {
    this.options = options
    this.pkg = pkg
    this.prepareRelease(callback)
  }

  private getShellScriptPath = (): string => {
    return __dirname.replace(/ /g, '\\ ') + '/prepare-release.sh'
  }

  private getShellScriptForPreReleasePath = (): string => {
    return __dirname.replace(/ /g, '\\ ') + '/prepare-release-label.sh'
  }

  private setVersion(): number {
    return (this.options.preReleaseLabel ? this.pkg.version.replace(this.options.preReleaseLabel, '') : this.pkg.version)
  }

  public prepareRelease = (callback: () => void): void => {
    exec('sh ' + this.getShellScriptPath() + ' ' + this.setVersion(), (err: any) => {
      if (!err) {
        callback()

        if (this.options.preReleaseLabel) {
          this.commitSnapShot()
        }
      } else {
        ErrorHandler.handle(err)
      }
    })
  }

  public commitSnapShot() {
    exec('sh ' + this.getShellScriptForPreReleasePath() + ' ' + this.setVersion() + this.options.preReleaseLabel, (err: any) => {
      if (!err) {
        return
      } else {
        ErrorHandler.handle(err)
      }
    })
  }
}

export { PrepareRelease }