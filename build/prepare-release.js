"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const error_1 = require("./error");
class PrepareRelease {
    constructor(pkg, options) {
        this.getShellScriptPath = () => {
            return __dirname.replace(/ /g, '\\ ') + '/prepare-release.sh';
        };
        this.prepareRelease = () => {
            child_process_1.exec('sh ' + this.getShellScriptPath() + ' ' + this.setVersion(), (err) => {
                if (!err) {
                    return;
                }
                error_1.ErrorHandler.handle(err);
            });
        };
        this.options = options;
        this.pkg = pkg;
        this.prepareRelease();
    }
    setVersion() {
        return (this.options.releaseLabel ? this.pkg.version.replace(this.options.releaseLabel, '') : this.pkg.version);
    }
}
exports.PrepareRelease = PrepareRelease;
