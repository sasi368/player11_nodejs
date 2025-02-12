import express from "express";
import { createTeam, getTeams } from "../../controllers/teamsController";

// Route definitions
const teamRouter = express.Router();
//get
teamRouter.post("/getTeams", getTeams);
//post
teamRouter.post("/createTeam", createTeam);

export { teamRouter };
