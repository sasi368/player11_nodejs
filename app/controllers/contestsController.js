import { contestList, Teams, JoinContest } from "../models";

export const insertContests = async (req, res) => {
  try {
    const { contests } = req.body; // Extract "contests" parameter from request body

    if (!contests || !Array.isArray(contests)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. 'contests' should be an array.",
      });
    }

    const insertedContests = await contestList.insertMany(contests);

    return res.status(200).json({
      success: true,
      message: "Contests inserted successfully",
      data: insertedContests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getContests = async (req, res) => {
  try {
    // Fetch all contest categories with their contests
    const contests = await contestList.find();

    // Check if contests exist
    if (contests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contests found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contests retrieved successfully",
      data: contests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const joinContest = async (req, res) => {
  const { contestId, teamIds, userId } = req.body;

  // Validate inputs
  if (
    !contestId ||
    !teamIds ||
    !Array.isArray(teamIds) ||
    teamIds.length === 0 ||
    !userId
  ) {
    return res.status(400).json({
      message:
        "Contest ID, team IDs, and user ID are required and teamIds must be an array",
    });
  }

  try {
    // Check if the contest exists
    const contest = await contestList
      .findOne({ "availableContests._id": contestId })
      .select("availableContests.$");
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Check if all the teams exist
    const teams = await Teams.find({ _id: { $in: teamIds } });
    if (teams.length !== teamIds.length) {
      return res.status(404).json({ message: "One or more teams not found" });
    }

    // Check if there are available spots in the contest
    if (contest.spotsBooked + teamIds.length > contest.totalSpots) {
      return res.status(400).json({
        message: "Not enough spots available in this contest for all teams",
      });
    }

    // Check if the user has exceeded max entries for the contest
    const userEntries = await JoinContest.find({
      contest: contestId,
      user: userId,
    });
    const totalUserEntries = userEntries.length;

    if (totalUserEntries + teamIds.length > contest.maxEntry) {
      return res.status(400).json({
        message: `You have reached the maximum allowed entries (${contest.maxEntry}) for this contest.`,
      });
    }

    // Check if the user is trying to join the contest with the same team again
    const duplicateEntries = await JoinContest.find({
      contest: contestId,
      user: userId,
      teams: { $in: teamIds }, // Check if any of the selected teams are already joined by the user in the same contest
    });

    if (duplicateEntries.length > 0) {
      return res.status(400).json({
        message: "You have already joined this contest with the same team(s).",
      });
    }

    // Update spotsBooked in the contest
    contest.spotsBooked += teamIds.length;
    await contest.save();

    // Create a new record in JoinedContest for the multiple teams
    const joinedContest = new JoinContest({
      contest: contestId,
      teams: teams,
      user: userId,
    });

    // Save the joined contest
    await joinedContest.save();

    return res.status(200).json({
      message: "Teams successfully joined the contest",
      joinedContest,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const joinContestList = async (req, res) => {
  const { userId } = req.body; // Get userId from request body

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  try {
    // Find all contests joined by the user
    const joinedContests = await JoinContest.find({ user: userId })
      .lean()
      .populate("teams");

    if (!joinedContests.length) {
      return res.status(404).json({
        message: "No contests found for this user",
      });
    }

    // Extract contest IDs
    const contestIds = joinedContests.map((contest) => contest.contest);

    // Fetch the contests from availableContests
    const contestCategories = await contestList.find(
      { "availableContests._id": { $in: contestIds } },
      { "availableContests.$": 1 }
    );

    // Map contest details
    const contestMap = {};
    contestCategories.forEach((category) => {
      if (category.availableContests.length > 0) {
        const contest = category.availableContests[0];
        contestMap[contest._id.toString()] = contest;
      }
    });

    // Attach full contest details to each joined contest
    const updatedContests = joinedContests.map((contest) => ({
      ...contest,
      contest: contestMap[contest.contest.toString()] || null,
    }));

    return res.status(200).json({
      message: "Contests successfully fetched",
      data: updatedContests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
