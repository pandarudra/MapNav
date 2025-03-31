import express from "express";
import { getOptimumPath } from "../controllers/routerController";

const router = express.Router();
router.post("/find", getOptimumPath);
export default router;
