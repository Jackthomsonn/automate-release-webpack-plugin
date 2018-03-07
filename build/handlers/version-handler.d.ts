declare class VersionHandler {
    protected pkg: any;
    constructor(pkg: any);
    protected handleVersion(): void;
    protected getVersionNumberToUpdate: (index: number) => any;
}
export { VersionHandler };
