const sendBoomError = (res, boomError) => {
  res.status(boomError.output.statusCode).send({
    status : false,
    statusCode : boomError.output.statusCode,
    body: {message : boomError.output.payload.message},
  });
};

const sendResponse = (res, data, statusCode = 200,status) => {
  return res.status(statusCode).json({
    status: status,
    statusCode,
    body: data,
  });
};

module.exports = {
    sendBoomError,
    sendResponse
}