import { Router, type IRouter } from "express";
import healthRouter from "./health";
import feedbackRouter from "./feedback";
import profileRouter from "./profile";
import sessionsRouter from "./sessions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(feedbackRouter);
router.use(profileRouter);
router.use(sessionsRouter);

export default router;
