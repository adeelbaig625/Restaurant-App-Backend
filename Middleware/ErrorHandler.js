const ErrorHandler = (err, req, res, next) => {
  console.log("Middleware Error Hadnling");
  const errStatus = res.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    message: errMsg,
  });
};

module.exports = ErrorHandler;
