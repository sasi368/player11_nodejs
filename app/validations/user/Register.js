import { MESSAGES } from "../../constants/messages";
import { REGEX_INDIAN_MOBILE, REGEX_COUNTRY_CODE } from "../Regex";

const validateRegister = (req) => {
  const { country_code, mobile_no } = req;
  let errors = {};

  if (!country_code) {
    errors.country_code = MESSAGES.COUNTRY_CODE_REQUIRED;
  } else if (!REGEX_COUNTRY_CODE.test(country_code)) {
    errors.country_code = MESSAGES.INVALID_COUNTRY_CODE;
  }

  if (!mobile_no) {
    errors.mobile_no = MESSAGES.MOBILE_NUMBER_REQUIRED;
  } else if (!REGEX_INDIAN_MOBILE.test(mobile_no)) {
    errors.mobile_no = MESSAGES.INVALID_INDIAN_MOBILE;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export { validateRegister };
