function createHttpError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeDatabaseError(error, fallbackMessage = "Request could not be completed.") {
  if (error?.statusCode) {
    return error;
  }

  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "record";
    return createHttpError(`${duplicateField} already exists.`, 409);
  }

  if (error?.name === "ValidationError") {
    const firstIssue = Object.values(error.errors || {})[0];
    return createHttpError(firstIssue?.message || "Invalid data provided.", 400);
  }

  if (error?.name === "CastError") {
    return createHttpError("Invalid identifier or value provided.", 400);
  }

  return createHttpError(fallbackMessage, 500);
}

module.exports = {
  createHttpError,
  normalizeDatabaseError,
};
