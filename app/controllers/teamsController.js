import { Teams } from "../models";
import { userBasicDetails } from "../models/files/userModel";
import { Types } from "../services/mongoose";

export const createTeam = async (req, res) => {
  try {
    const { userId, matchId, selectedPlayers } = req.body;

    if (!userId || !matchId) {
      return res
        .status(400)
        .json({ message: "userId and matchId are required." });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    const userExists = await userBasicDetails.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!selectedPlayers || selectedPlayers.length !== 11) {
      return res
        .status(400)
        .json({ message: "Invalid input, select 11 players." });
    }

    const requiredRoles = ["Batsman", "Bowler", "WK-Batsman", "AllRounder"];
    const roleCount = {};
    requiredRoles.forEach((role) => (roleCount[role] = 0));

    selectedPlayers.forEach((player) => {
      if (roleCount[player.role] !== undefined) {
        roleCount[player.role] += 1;
      }
    });

    const hasAllRoles = Object.values(roleCount).every((count) => count >= 1);
    if (!hasAllRoles) {
      return res
        .status(400)
        .json({ message: "Team must have at least one player per role." });
    }

    const team = new Teams({ userId, matchId, selectedPlayers });
    await team.save();

    res.json({ message: "Team Created Successfully.", team });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    const userExists = await userBasicDetails.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    const teams = await Teams.find({ userId });
    if (!teams.length) {
      return res.status(404).json({ message: "No teams found for this user." });
    }
    res.json({ message: "Teams retrieved successfully.", teams });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
