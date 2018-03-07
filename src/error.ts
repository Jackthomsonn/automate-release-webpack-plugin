class ErrorHandler {
  public static handle: any;

	public static __initialize_static_members() {
		ErrorHandler.handle=(error: Error) => {
    process.stdout.write('Automate Release Webpack Plugin Error: ', error.message)
  };
	}
}

export { ErrorHandler };ErrorHandler.__initialize_static_members();
