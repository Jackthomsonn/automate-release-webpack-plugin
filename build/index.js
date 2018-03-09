"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const prepare_release_1 = require("./prepare-release");
const handle_major_1 = require("./handlers/handle-major");
const handle_minor_1 = require("./handlers/handle-minor");
const handle_patch_1 = require("./handlers/handle-patch");
const error_1 = require("./error");
class AutomateRelease {
    constructor(options) {
        this.apply = (compiler) => {
            compiler.plugin('done', () => {
                try {
                    this.checkReleaseLabelIsPresentInPackageJson();
                    this.checkLabelIsPresentInConfig();
                    this.startAutomation();
                }
                catch (err) {
                    error_1.ErrorHandler.handle(err);
                }
            });
        };
        this.updateVersionNumber = (type) => {
            if (this.options.releaseLabel) {
                this.removeReleaseLabel();
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
        this.options = Object.assign({ releaseLabel: undefined }, options);
        this.pkg = require(path.resolve('./', 'package.json'));
        this.semverTypes = ['major', 'minor', 'patch'];
        if (this.options.releaseLabel && !this.options.releaseLabel.includes('-')) {
            this.constructReleaseLabel();
        }
    }
    checkReleaseLabelIsPresentInPackageJson() {
        if (this.options.releaseLabel && !this.pkg.version.includes(this.options.releaseLabel)) {
            throw ({ message: `Release label is missing or does not match what you have specified in the config. Add '${this.options.releaseLabel}' to your package.json or remove the releaselabel from the config` });
        }
    }
    checkLabelIsPresentInConfig() {
        if (!this.options.releaseLabel && this.pkg.version.includes('-')) {
            throw ({ message: `Release label is present in your package json but not set in the config. Remove '${this.pkg.version.split('-').pop()}' or set releaseLabel in the options config to '${this.pkg.version.split('-').pop()}'` });
        }
    }
    startAutomation() {
        new prepare_release_1.PrepareRelease(this.pkg, this.options);
        this.pkg.version = this.updateVersionNumber(this.findType().toString());
        if (this.options.releaseLabel) {
            this.addReleaseLabel();
        }
        fs.writeFileSync('package.json', this.parsePackageJson());
    }
    constructReleaseLabel() {
        this.options.releaseLabel = '-' + this.options.releaseLabel;
    }
    removeReleaseLabel() {
        this.pkg.version = this.pkg.version.replace(this.options.releaseLabel, '');
    }
    addReleaseLabel() {
        this.pkg.version = this.pkg.version + this.options.releaseLabel;
    }
}
exports.AutomateRelease = AutomateRelease;
