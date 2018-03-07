"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler {
}
ErrorHandler.handle = (error) => {
    process.stdout.write('Automate Release Webpack Plugin Error: ', error.message);
};
exports.ErrorHandler = ErrorHandler;
