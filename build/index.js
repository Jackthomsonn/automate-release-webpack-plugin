"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const error_1 = require("./error");
const handle_major_1 = require("./handlers/handle-major");
const handle_minor_1 = require("./handlers/handle-minor");
const handle_patch_1 = require("./handlers/handle-patch");
const prepare_release_1 = require("./prepare-release");
class AutomateRelease {
    constructor(options) {
        this.apply = (compiler) => {
            compiler.plugin('emit', (comp) => {
                if (comp.errors.length === 0) {
                    try {
                        this.checkReleaseLabelIsPresentInPackageJson();
                        this.checkLabelIsPresentInConfig();
                        this.startAutomation();
                    }
                    catch (err) {
                        error_1.ErrorHandler.handle(err);
                    }
                }
                else {
                    // tslint:disable-next-line:no-console
                    console.log(comp.errors.toString());
                }
            });
        };
        this.updateVersionNumber = (type) => {
            if (this.options.preReleaseLabel) {
                this.removePreReleaseLabel();
            }
            switch (type) {
                case 'major':
                    return new handle_major_1.HandleMajor(this.pkg).handleVersion();
                case 'minor':
                    return new handle_minor_1.HandleMinor(this.pkg).handleVersion();
                case 'patch':
                    return new handle_patch_1.HandlePatch(this.pkg).handleVersion();
            }
        };
        this.findType = () => {
            return this.semverTypes.filter((element) => {
                return process.argv.includes(element);
            });
        };
        this.parsePackageJson = () => {
            return JSON.stringify(this.pkg, null, 2);
        };
        this.options = this.populateDefaultOptionsConfig(options);
        this.pkg = require(path.resolve('./', 'package.json'));
        this.semverTypes = ['major', 'minor', 'patch'];
        if (this.options.preReleaseLabel && !this.options.preReleaseLabel.includes('-')) {
            this.constructReleaseLabel();
        }
    }
    populateDefaultOptionsConfig(options) {
        return Object.assign({ preReleaseLabel: undefined }, options);
    }
    checkReleaseLabelIsPresentInPackageJson() {
        if (this.options.preReleaseLabel && !this.pkg.version.includes(this.options.preReleaseLabel)) {
            throw ({
                // tslint:disable-next-line:max-line-length
                message: `preReleaseLabel is missing or does not match what you have specified in the config. Add '${this.options.preReleaseLabel}' to your package.json or remove the preReleaseLabel from the config`
            });
        }
    }
    checkLabelIsPresentInConfig() {
        if (!this.options.preReleaseLabel && this.pkg.version.includes('-')) {
            throw ({
                // tslint:disable-next-line:max-line-length
                message: `preReleaseLabel is present in your package json but not set in the config. Remove '${this.pkg.version.split('-').pop()}' or set the preReleaseLabel in the options config to '${this.pkg.version.split('-').pop()}'`
            });
        }
    }
    startAutomation() {
        new prepare_release_1.PrepareRelease(this.pkg, this.options);
        this.pkg.version = this.updateVersionNumber(this.findType().toString());
        if (this.options.preReleaseLabel) {
            this.addPreReleaseLabel();
        }
        fs.writeFileSync('package.json', this.parsePackageJson());
    }
    constructReleaseLabel() {
        this.options.preReleaseLabel = '-' + this.options.preReleaseLabel;
    }
    removePreReleaseLabel() {
        this.pkg.version = this.pkg.version.replace(this.options.preReleaseLabel, '');
    }
    addPreReleaseLabel() {
        this.pkg.version = this.pkg.version + this.options.preReleaseLabel;
    }
}
exports.AutomateRelease = AutomateRelease;
