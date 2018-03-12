"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const error_1 = require("./error");
class PrepareRelease {
    constructor(pkg, options, callback) {
        this.getShellScriptPath = () => {
            return __dirname.replace(/ /g, '\\ ') + '/prepare-release.sh';
        };
        this.getShellScriptForPreReleasePath = () => {
            return __dirname.replace(/ /g, '\\ ') + '/prepare-release-label.sh';
        };
        this.prepareRelease = (callback) => {
            child_process_1.exec('sh ' + this.getShellScriptPath() + ' ' + this.setVersion(), (err) => {
                if (!err) {
                    callback();
                    if (this.options.preReleaseLabel) {
                        this.commitSnapShot();
                    }
                }
                else {
                    error_1.ErrorHandler.handle(err);
                }
            });
        };
        this.options = options;
        this.pkg = pkg;
        this.prepareRelease(callback);
    }
    setVersion() {
        return (this.options.preReleaseLabel ? this.pkg.version.replace(this.options.preReleaseLabel, '') : this.pkg.version);
    }
    commitSnapShot() {
        child_process_1.exec('sh ' + this.getShellScriptForPreReleasePath() + ' ' + this.setVersion() + this.options.preReleaseLabel, (err) => {
            if (!err) {
                return;
            }
            else {
                error_1.ErrorHandler.handle(err);
            }
        });
    }
}
exports.PrepareRelease = PrepareRelease;
