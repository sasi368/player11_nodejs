import express from "express";
import path from "path";
import {
  matchDetails,
  upcomingMatches,
} from "../../controllers/matchesController.js";

// Route definitions
const matchesRouter = express.Router();
//get
matchesRouter.get("/upcomingMatches", upcomingMatches);
matchesRouter.use(
  "/team-logos",
  express.static(path.join(__dirname, "../../../public/team-logos"))
);
//post
matchesRouter.post("/matchDetails", matchDetails);

export { matchesRouter };
