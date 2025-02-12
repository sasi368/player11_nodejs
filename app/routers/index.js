import { router as commonRouter } from "../config/serverConfig.js";
import { userRouter } from "./files/userRouter.js";
import { matchesRouter } from "./files/matchesRouter.js";
import { contestRouter } from "./files/contestsRouter.js";
import { teamRouter } from "./files/teamRouter.js";

commonRouter.use("/users", userRouter);
commonRouter.use("/matches", matchesRouter);
commonRouter.use("/contests", contestRouter);
commonRouter.use("/teams", teamRouter);

export default commonRouter;
