"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_handler_1 = require("./version-handler");
class HandleMinor extends version_handler_1.VersionHandler {
    handleVersion() {
        return this.pkg.version.substr(0, 2) + (Number(this.getVersionNumberToUpdate(1)) + 1) + '.' + this.pkg.version.substr(3 + 1);
    }
}
exports.HandleMinor = HandleMinor;
