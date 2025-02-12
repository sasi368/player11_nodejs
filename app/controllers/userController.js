import { MESSAGES } from "../constants/messages";
import { userBasicDetails, userWalletDetails } from "../models";
import { generateToken } from "../services/JWT";
import {
  sendErrorResponse,
  sendValidationResponse,
} from "../utils/responseUtils";
import { validateRegister } from "../validations/user/Register";
import { validateAddBalance } from "../validations/user/Wallet";

export const register = async (req, res) => {
  const { country_code, mobile_no } = req.body;

  try {
    // Run validation
    const validationErrors = validateRegister(req.body);
    if (validationErrors) {
      return sendValidationResponse(res, "", validationErrors);
    }

    // Check if user already exists with the same country_code & mobile_no
    const existingUser = await userBasicDetails.findOne({
      country_code,
      mobile_no,
    });
    if (existingUser) {
      return sendValidationResponse(res, "", {
        mobile_no: MESSAGES.USER_ALREADY_EXISTS,
      });
    }

    // Create new user with separate country code & mobile number
    const newUser = new userBasicDetails({ country_code, mobile_no });
    await newUser.save();

    // Create a wallet for the new user
    const newWallet = new userWalletDetails({ user_id: newUser._id });
    await newWallet.save();

    const token = generateToken(newUser._id);

    res.status(200).json({
      message: MESSAGES.USER_REGISTERED,
      user: newUser,
      wallet: newWallet,
      token: token,
      status: true,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userBasicDetails.find().lean(); // Fetch users and convert to plain objects

    // Fetch wallet details for each user
    const usersWithWallet = await Promise.all(
      users.map(async (user) => {
        const wallet = await userWalletDetails
          .findOne({ user_id: user._id })
          .lean();
        return { ...user, wallet }; // Merge wallet details into user object
      })
    );

    res.status(200).json(usersWithWallet);
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

export const addWalletBalance = async (req, res) => {
  const { user_id, amount } = req.body;

  // Run validation
  const validationErrors = validateAddBalance(user_id, amount);
  if (validationErrors) {
    return sendValidationResponse(res, "", validationErrors);
  }

  try {
    // Check if user wallet exists
    const userWallet = await userWalletDetails.findOne({ user_id });

    if (!userWallet) {
      return sendValidationResponse(res, MESSAGES.USER_WALLET_NOT_FOUND, []);
    }

    // Update wallet balance
    userWallet.currentBalance += amount;
    await userWallet.save();

    res.status(200).json({
      message: MESSAGES.BALANCE_ADDED_SUCCESS,
      wallet: userWallet,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const updateData = req.body;

    // Check if user exists
    const user = await userBasicDetails.findById(user_id);
    if (!user) {
      return sendValidationResponse(res, MESSAGES.USER_NOT_FOUND, []);
    }

    // Update user details
    const updatedUser = await userBasicDetails.findByIdAndUpdate(
      user_id,
      updateData,
      { new: true, runValidators: true }
      // new: true	Returns the updated document instead of the old one.
      // runValidators: true	Ensures Mongoose schema validations apply during update.
    );

    res.status(200).json({
      message: MESSAGES.PROFILE_UPDATED,
      user: updatedUser,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};
