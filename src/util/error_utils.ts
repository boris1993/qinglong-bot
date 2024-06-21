/**
 * Properly extracting the error message.
 * @see https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
 * @param error The error object.
 * @return The extracted error message.
 */
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    } else {
        return String(error);
    }
}

export {
    getErrorMessage,
}
