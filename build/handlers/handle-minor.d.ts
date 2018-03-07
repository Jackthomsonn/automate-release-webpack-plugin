import { VersionHandler } from './version-handler';
declare class HandleMinor extends VersionHandler {
    constructor(pkg: any);
    handleVersion(): string;
}
export { HandleMinor };
