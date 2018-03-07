class ErrorHandler {
  public static handle = (error: Error) => {
    process.stdout.write('Automate Release Webpack Plugin Error: ', error.message)
  }
}

export { ErrorHandler }