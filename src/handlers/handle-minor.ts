import { VersionHandler } from './version-handler'

class HandleMinor extends VersionHandler {
  constructor(pkg: any) {
    super(pkg)
  }

  public handleVersion() {
    return this.pkg.version.substr(0, 2) + (Number(this.getVersionNumberToUpdate(1)) + 1) + '.' + this.pkg.version.substr(3 + 1)
  }
}

export { HandleMinor }