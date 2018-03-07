"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const prepare_release_1 = require("./prepare-release");
class AutomateRelease {
    constructor() {
        this.apply = (compiler) => {
            compiler.plugin('done', () => {
                console.log(this.updateVersionNumber(this.findType().toString()));
                this.pkg.version = this.updateVersionNumber(this.findType().toString());
                fs.writeFileSync('package.json', this.parsePackageJson());
                new prepare_release_1.PrepareRelease(this.pkg);
            });
        };
        this.getVersionNumberToUpdate = (index) => {
            return this.pkg.version.split('.')[index];
        };
        this.handleMajor = () => {
            return this.pkg.version.substr(0, 0) + (Number(this.getVersionNumberToUpdate(0)) + 1) + '.' + '0.0';
        };
        this.handleMinor = () => {
            return this.pkg.version.substr(0, 2) + (Number(this.getVersionNumberToUpdate(1)) + 1) + '.' + this.pkg.version.substr(3 + 1);
        };
        this.handlePatch = () => {
            return this.pkg.version.substr(0, 4) + (Number(this.getVersionNumberToUpdate(2)) + 1) + this.pkg.version.substr(5 + 1);
        };
        this.updateVersionNumber = (type) => {
            let semverType;
            switch (type) {
                case 'major':
                    semverType = this.handleMajor();
                    break;
                case 'minor':
                    semverType = this.handleMinor();
                    break;
                case 'patch':
                    semverType = this.handlePatch();
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
