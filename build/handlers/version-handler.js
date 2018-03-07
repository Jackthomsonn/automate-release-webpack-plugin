"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VersionHandler {
    constructor(pkg) {
        this.getVersionNumberToUpdate = (index) => {
            return this.pkg.version.split('.')[index];
        };
        this.pkg = pkg;
    }
    handleVersion() {
        return;
    }
}
exports.VersionHandler = VersionHandler;
