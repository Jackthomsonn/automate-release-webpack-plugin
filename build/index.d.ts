/// <reference types="webpack" />
import { Compiler } from 'webpack';
declare class AutomateRelease {
    protected pkg: any;
    private semverTypes;
    private options;
    constructor(options: AutomateReleasePlugin.IOptions);
    apply: (compiler: Compiler) => void;
    private checkReleaseLabelIsPresentInPackageJson();
    private checkLabelIsPresentInConfig();
    private startAutomation();
    private constructReleaseLabel();
    private updateVersionNumber;
    private findType;
    private parsePackageJson;
    private removeReleaseLabel();
    private addReleaseLabel();
}
export { AutomateRelease };
