"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const prepare_release_1 = require("./prepare-release");
const handle_major_1 = require("./handlers/handle-major");
const handle_minor_1 = require("./handlers/handle-minor");
const handle_patch_1 = require("./handlers/handle-patch");
class AutomateRelease {
    constructor() {
        this.apply = (compiler) => {
            compiler.plugin('done', () => {
                this.pkg.version = this.updateVersionNumber(this.findType().toString());
                fs.writeFileSync('package.json', this.parsePackageJson());
                new prepare_release_1.PrepareRelease(this.pkg);
            });
        };
        this.updateVersionNumber = (type) => {
            let semverType;
            switch (type) {
                case 'major':
                    semverType = new handle_major_1.HandleMajor(this.pkg);
                    break;
                case 'minor':
                    semverType = new handle_minor_1.HandleMinor(this.pkg);
                    break;
                case 'patch':
                    semverType = new handle_patch_1.HandlePatch(this.pkg);
                    break;
            }
            return semverType;
        };
        this.findType = () => {
            return this.semverTypes.filter((element) => {
                return process.argv.includes(element);
            });
        };
        this.parsePackageJson = () => {
            return JSON.stringify(this.pkg, null, 2);
        };
        this.pkg = require(path.resolve('./', 'package.json'));
        this.semverTypes = ['major', 'minor', 'patch'];
    }
}
exports.AutomateRelease = AutomateRelease;
