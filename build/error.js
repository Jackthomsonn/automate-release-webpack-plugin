"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
class ErrorHandler {
    static __initialize_static_members() {
        ErrorHandler.handle = (error) => {
            console.log(chalk_1.default.bold.magentaBright('Automate Release Webpack Plugin Error:'), chalk_1.default.italic.blue(error.message));
        };
    }
}
exports.ErrorHandler = ErrorHandler;
ErrorHandler.__initialize_static_members();
