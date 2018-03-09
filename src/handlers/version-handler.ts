class VersionHandler {
  protected pkg: any

  constructor(pkg: any) {
    this.pkg = pkg
  }

  protected getVersionNumberToUpdate = (index: number): string => {
    return this.pkg.version.split('.')[index]
  }
}

export { VersionHandler }