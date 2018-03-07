import { VersionHandler } from './version-handler'


class HandlePatch extends VersionHandler {
  constructor(pkg: any) {
    super(pkg)
  }

  public handleVersion() {
    return this.pkg.version.substr(0, 4) + (Number(this.getVersionNumberToUpdate(2)) + 1) + this.pkg.version.substr(5 + 1)
  }
}

export { HandlePatch }