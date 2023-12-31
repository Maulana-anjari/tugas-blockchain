function ErrorHandler(status, message) {
    this.status = status;
    this.message = message;
}
module.exports = ErrorHandler;