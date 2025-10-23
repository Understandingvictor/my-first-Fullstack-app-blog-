const throwErrorMessage = (message, statusCode) => {
    const err = new Error(message);
    err.status = statusCode;
    throw err;
}
export default throwErrorMessage;