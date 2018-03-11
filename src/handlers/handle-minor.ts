import { VersionHandler } from './version-handler'

class HandleMinor extends VersionHandler {
  public handleVersion(): string {
    return this.pkg.version.substr(0, 2) + (Number(this.getVersionNumberToUpdate(1)) + 1) + '.' + + '0'
  }
}

export { HandleMinor }