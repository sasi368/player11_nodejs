import { mongoose, Types } from "../../services/mongoose";

const teamSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "users", required: true },
  matchId: { type: String, required: true },
  selectedPlayers: { type: Array, required: true },
});

export const Teams = mongoose.model("teams", teamSchema);
