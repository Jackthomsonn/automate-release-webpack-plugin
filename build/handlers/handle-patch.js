"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_handler_1 = require("./version-handler");
class HandlePatch extends version_handler_1.VersionHandler {
    handleVersion() {
        return this.pkg.version.substr(0, 4) + (Number(this.getVersionNumberToUpdate(2)) + 1) + this.pkg.version.substr(5 + 1);
    }
}
exports.HandlePatch = HandlePatch;
