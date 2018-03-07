import { VersionHandler } from './version-handler';
declare class HandleMajor extends VersionHandler {
    constructor(pkg: any);
    handleVersion(): string;
}
export { HandleMajor };
