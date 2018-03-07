class VersionHandler {
  protected pkg: any

  constructor(pkg: any) {
    this.pkg = pkg
  }

  protected handleVersion() {
    return
  }

  protected getVersionNumberToUpdate = (index: number) => {
    return this.pkg.version.split('.')[index]
  }
}

export { VersionHandler }