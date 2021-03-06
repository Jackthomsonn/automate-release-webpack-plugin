declare class AutomateRelease {
    private pkg;
    private semverTypes;
    private options;
    constructor(options: AutomateReleasePlugin.IOptions);
    apply: (compiler: any) => void;
    private startFileChecks;
    private populateDefaultOptionsConfig(options);
    private checkReleaseLabelIsPresentInPackageJson();
    private checkLabelIsPresentInConfig();
    private handleLabeledRelease();
    private handleNonLabledRelease();
    private startAutomation();
    private constructReleaseLabel();
    private updateVersionNumber;
    private findType;
    private shouldSkipBuild;
    private parsePackageJson;
    private removePreReleaseLabel();
    private addPreReleaseLabel();
}
export { AutomateRelease };
