import axios from "axios";

//site
// https://rapidapi.com/cricketapilive/api/cricbuzz-cricket/playground

const BASE_URL = "https://cricbuzz-cricket.p.rapidapi.com";
const headers = {
  "X-RapidAPI-Key": process.env.rapid_livescore_key, // Replace with your RapidAPI key
  "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com",
};

export const getUpcomingMatchesFromcricBuzz = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/matches/v1/upcoming`, {
      headers,
    });
    const internationalMatches = response.data.typeMatches.find(
      (matchType) => matchType.matchType === "International"
    );
    return {
      result: internationalMatches,
      status: true,
    };
  } catch (error) {
    console.log("getUpcomingMatchesFromcricBuzz error:", error);
    return {
      result: {},
      status: false,
    };
  }
};

export const getMatchDetailsFromcricBuzz = async (matchId) => {
  try {
    const response = await axios.get(`${BASE_URL}/mcenter/v1/${matchId}`, {
      headers,
    });

    return {
      result: response.data,
      status: true,
    };
  } catch (error) {
    console.log("getTeamDetailssFromcricBuzz err", error);
    return {
      result: {},
      status: false,
    };
  }
};
