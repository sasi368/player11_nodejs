import { model, Schema } from "../../services/mongoose";

// Define the Contest Schema
const ContestSchema = new Schema({
  contestLabel: { type: String, required: true },
  maxPriceAmt: { type: Number, required: true },
  entryFee: { type: Number, required: true },
  discountAmt: { type: Number, required: true },
  totalSpots: { type: Number, required: true },
  spotsBooked: { type: Number, required: true },
  maxEntry: { type: Number, required: true },
  winningPer: { type: Number, required: true },
});

// Define the Contest Category Schema
const ContestCategorySchema = new Schema({
  contestCategory: { type: String, required: true },
  availableContests: [ContestSchema],
});

export const contestList = model("contestList", ContestCategorySchema);

// Define the Join Contest Schema
const JoinContestSchema = new Schema({
  contest: { type: Schema.Types.ObjectId, required: true }, // Reference to contest
  teams: [{ type: Schema.Types.ObjectId, ref: "teams", required: true }], // Array of references to selected teams
  user: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Reference to user
  dateJoined: { type: Date, default: Date.now },
});

// Create model for the Joined Contest
export const JoinContest = model("JoinedContest", JoinContestSchema);
