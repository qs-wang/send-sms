export function createResponse(res, statusCode, errorMsg, message, body) {
  return res
    .status(statusCode)
    .json({
      ...errorMsg && {
        errorMsg
      },
      ...message && {
        message
      },
      ...body && {
        body
      },
    });
}