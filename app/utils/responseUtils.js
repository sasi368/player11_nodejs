import { MESSAGES } from "../constants/messages.js";
import isEmpty from "./isEmpty.js";

export const sendErrorResponse = (res, error) => {
  console.log("sendErrorResponse called");

  res.status(500).json({
    error: !isEmpty(error.message)
      ? error.message
      : MESSAGES.INTERNAL_SERVER_ERROR,
    status: false,
  });
};

export const sendValidationResponse = (res, err, errs) => {
  console.log("sendValidationResponse called");

  res.status(400).json({
    error: err,
    errors: errs,
    status: false,
  });
};
