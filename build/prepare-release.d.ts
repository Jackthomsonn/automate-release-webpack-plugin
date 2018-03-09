declare class PrepareRelease {
    private pkg;
    private options;
    constructor(pkg: any, options: AutomateReleasePlugin.IOptions);
    private getShellScriptPath;
    private setVersion();
    private prepareRelease;
}
export { PrepareRelease };
