import { Router, type IRouter } from "express";
import healthRouter from "./health";
import feedbackRouter from "./feedback";

const router: IRouter = Router();

router.use(healthRouter);
router.use(feedbackRouter);

export default router;
