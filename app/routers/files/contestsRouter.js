import express from "express";
import {
  getContests,
  insertContests,
  joinContest,
  joinContestList,
} from "../../controllers/contestsController.js";

// Route definitions
const contestRouter = express.Router();
//get
contestRouter.get("/getContests", getContests);
//post
contestRouter.post("/insertContests", insertContests);
contestRouter.post("/joinContest", joinContest);
contestRouter.post("/joinContestList", joinContestList);

export { contestRouter };
