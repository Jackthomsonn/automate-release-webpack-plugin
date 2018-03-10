import { exec } from 'child_process'
import { ErrorHandler } from './error'

class PrepareRelease {
  private pkg: any
  private options: AutomateReleasePlugin.IOptions

  constructor(pkg: any, options: AutomateReleasePlugin.IOptions) {
    this.options = options
    this.pkg = pkg
    this.prepareRelease()
  }

  private getShellScriptPath = (): string => {
    return __dirname.replace(/ /g, '\\ ') + '/prepare-release.sh'
  }

  private setVersion(): number {
    return (this.options.preReleaseLabel ? this.pkg.version.replace(this.options.preReleaseLabel, '') : this.pkg.version)
  }

  private prepareRelease = (): void => {
    exec('sh ' + this.getShellScriptPath() + ' ' + this.setVersion(), (err: any) => {
      if (!err) {
        return
      }

      ErrorHandler.handle(err)
    })
  }
}

export { PrepareRelease }