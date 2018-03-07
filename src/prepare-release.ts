import { exec } from 'child_process'
import { ErrorHandler } from './error'

class PrepareRelease {
  private pkg: any

  constructor(pkg: any) {
    this.pkg = pkg
    this.prepareRelease()
  }

  private getShellScriptPath = () => {
    return __dirname.replace(/ /g, '\\ ') + '/prepare-release.sh'
  }

  private prepareRelease = () => {
    exec('sh ' + this.getShellScriptPath() + ' ' + this.pkg.version, (err: any) => {
      if (!err) {
        return
      }

      ErrorHandler.handle(err)
    })
  }
}

export { PrepareRelease }