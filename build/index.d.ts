/// <reference types="webpack" />
import { Compiler } from 'webpack';
declare class AutomateRelease {
    protected pkg: any;
    private semverTypes;
    constructor();
    apply: (compiler: Compiler) => void;
    private updateVersionNumber;
    private findType;
    private parsePackageJson;
}
export { AutomateRelease };
