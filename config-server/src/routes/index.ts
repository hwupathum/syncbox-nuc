import express from "express";
import user_routes from "./user.routes";
import directory_routes from "./directory.routes";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));
router.use(user_routes);
router.use(directory_routes);

export default router;
