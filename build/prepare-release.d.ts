declare class PrepareRelease {
    private pkg;
    private options;
    constructor(pkg: any, options: AutomateReleasePlugin.IOptions, callback: () => void);
    private getShellScriptPath;
    private getShellScriptForPreReleasePath;
    private setVersion();
    prepareRelease: (callback: () => void) => void;
    commitSnapShot(): void;
}
export { PrepareRelease };
