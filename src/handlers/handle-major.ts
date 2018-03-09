import { VersionHandler } from './version-handler'

class HandleMajor extends VersionHandler {
  public handleVersion(): string {
    return this.pkg.version.substr(0, 0) + (Number(this.getVersionNumberToUpdate(0)) + 1) + '.' + '0.0'
  }
}

export { HandleMajor }