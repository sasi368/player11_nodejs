import {
  getMatchDetailsFromcricBuzz,
  getUpcomingMatchesFromcricBuzz,
} from "../services/cricbuzzApiProvider";
import isEmpty from "../utils/isEmpty";
import {
  sendErrorResponse,
  sendValidationResponse,
} from "../utils/responseUtils";

export const upcomingMatches = async (req, res) => {
  try {
    const cricBuzzResponse = await getUpcomingMatchesFromcricBuzz();

    if (!cricBuzzResponse.status) {
      return sendValidationResponse(
        res,
        "Failed to fetch upcoming matches",
        []
      );
    }

    const formatedRes = formatUpcomingResponse(cricBuzzResponse.result);
    res.status(200).json({
      message: "Upcoming matches fetched successfully",
      status: true,
      data: formatedRes,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

export const matchDetails = async (req, res) => {
  try {
    const { matchId } = req.body;
    const cricBuzzResponse = await getMatchDetailsFromcricBuzz(matchId);

    if (!cricBuzzResponse.status) {
      return sendValidationResponse(
        res,
        "Failed to fetch upcoming matches",
        []
      );
    }

    const formatedRes = formatMatchDetails(cricBuzzResponse.result);

    res.status(200).json({
      message: "match details fetched successfully",
      status: true,
      data: formatedRes,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

//response formatter
function formatUpcomingResponse(apiResponse) {
  const getLocalImagePath = (teamSymbol) =>
    `/matches/team-logos/${teamSymbol}.png`;

  let matches = apiResponse.seriesMatches
    .map((seriesWrapper) =>
      seriesWrapper.seriesAdWrapper?.matches.map((match) => ({
        matchId: match.matchInfo.matchId,
        matchName: match.matchInfo.seriesName,
        matchDescription: match.matchInfo.matchDesc,
        matchFormat: match.matchInfo.matchFormat,
        matchStartDate: match.matchInfo.startDate,
        matchEndDate: match.matchInfo.endDate,
        status: match.matchInfo.status,
        team1: {
          teamId: match.matchInfo.team1.teamId,
          teamName: match.matchInfo.team1.teamName,
          teamSymbol: match.matchInfo.team1.teamSName,
          teamImage: getLocalImagePath(match.matchInfo.team1.teamSName),
        },
        team2: {
          teamId: match.matchInfo.team2.teamId,
          teamName: match.matchInfo.team2.teamName,
          teamSymbol: match.matchInfo.team2.teamSName,
          teamImage: getLocalImagePath(match.matchInfo.team2.teamSName),
        },
        venue: {
          ground: match.matchInfo.venueInfo.ground,
          city: match.matchInfo.venueInfo.city,
        },
      }))
    )
    .flat(); // Flatten the resulting array

  let removeNullValues = matches?.filter((item) => !isEmpty(item));

  return removeNullValues;
}

function formatMatchDetails(matchData) {
  return {
    matchStartDate: matchData.matchInfo.matchStartTimestamp,
    matchEndDate: matchData.matchInfo.matchCompleteTimestamp,
    teamDetails: [matchData.matchInfo.team1, matchData.matchInfo.team2].map(
      (team) => ({
        teamId: team.id,
        teamName: team.name,
        players: team.playerDetails.map(
          ({
            id,
            fullName,
            nickName,
            faceImageId,
            keeper,
            substitute,
            name,
            role,
            ...player
          }) => ({
            playerId: id,
            playerName: name,
            role:
              role === "Bowling Allrounder" || role === "Batting Allrounder"
                ? "AllRounder"
                : role,
            ...player,
            ...player,
          })
        ),
      })
    ),
    venueDetails: {
      city: matchData.venueInfo.city,
      country: matchData.venueInfo.country,
      ground: matchData.venueInfo.ground,
    },
  };
}
