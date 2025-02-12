import { MESSAGES } from "../../constants/messages";

export const validateAddBalance = (user_id, amount) => {
  let errors = [];

  if (!user_id) {
    errors.push(MESSAGES.USER_ID_REQUIRED);
  }

  if (!amount || typeof amount !== "number" || amount <= 0) {
    errors.push(MESSAGES.AMOUNT_POSITIVE);
  }

  return errors.length > 0 ? errors : null;
};
