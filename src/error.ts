import chalk from 'chalk'

class ErrorHandler {
  public static handle: any;

  public static __initialize_static_members(): void {
    ErrorHandler.handle = (error: Error) => {
      console.log(chalk.bold.magentaBright('Automate Release Webpack Plugin Error:'), chalk.italic.blue(error.message))
    };
  }
}

export { ErrorHandler }; ErrorHandler.__initialize_static_members();
