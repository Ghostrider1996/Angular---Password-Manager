// Global Variables
const secret = "a662ab90-77c2-4876-af41-52efdbf009f7";
const identityName = "username"
// Error Parser
function parseError(err) {
  if (err instanceof Error) {
    if (!err.errors) {
      //Generic error
      err.errors = [err.message];
    } else {
      // Mongoose validation error
      const error = new Error("Input validation error");
      error.errors = Object.fromEntries(
        Object.values(err.errors).map((e) => [e.path, e.message])
      );

      return error;
    }
  } else if (Array.isArray(err)) {
    // Express validation error array
    const error = new Error("Input validation error");
    error.errors = Object.fromEntries(err.map((e) => [e.path, e.message]));
    return error;
  }
  return err;
}

module.exports = { secret, parseError, identityName };
