"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_handler_1 = require("./version-handler");
class HandleMajor extends version_handler_1.VersionHandler {
    constructor(pkg) {
        super(pkg);
    }
    handleVersion() {
        return this.pkg.version.substr(0, 0) + (Number(this.getVersionNumberToUpdate(0)) + 1) + '.' + '0.0';
    }
}
exports.HandleMajor = HandleMajor;
