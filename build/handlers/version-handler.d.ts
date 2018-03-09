declare class VersionHandler {
    protected pkg: any;
    constructor(pkg: any);
    protected getVersionNumberToUpdate: (index: number) => string;
}
export { VersionHandler };
