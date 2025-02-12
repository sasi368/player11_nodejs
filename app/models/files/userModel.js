import { model, Schema, Types } from "../../services/mongoose";

// Define the user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "", // Optional field with default empty string
    },
    email: {
      type: String,
      default: "", // Optional field with default empty string
    },
    mobile_no: {
      type: String,
      required: true, // Mandatory field
    },
    country_code: {
      type: String,
      required: true, // Mandatory field
    },
    gender: {
      type: String,
      default: "", // Optional, default empty string
    },
    address: {
      type: String,
      default: "", // Optional field with default empty string
    },
    date_of_birth: {
      type: Date,
      default: null, // Optional field, can be null
    },
    profileImage: {
      type: String,
      default: "", // Optional, link to the profile image
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    skill_scores: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
export const userBasicDetails = model("users", userSchema);

//user wallet schema
const userWalletSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId, // Referencing User's _id
      ref: "users", // Reference to the User collection
      required: true,
      unique: true, // Ensures each user has only one wallet
    },
    currentBalance: {
      type: Number,
      default: 0, // Optional field with default empty string
    },
    amounUnutilised: {
      type: Number,
      default: 0, // Optional field with default empty string
    },
    winnings: {
      type: Number,
      default: 0, // Optional field with default empty string
    },
    discountBonus: {
      type: Number,
      default: 0, // Optional field with default empty string
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
export const userWalletDetails = model("usersWallet", userWalletSchema);
