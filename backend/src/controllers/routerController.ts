import { Request, Response } from "express";
import { findShortestPath } from "../services/graphService";

export const getOptimumPath = (req: Request, res: Response): void => {
  const { start, end } = req.body;

  if (!start || !end) {
    res.status(400).json({ error: "Start and end points are required" });
    return;
  }
  const path = findShortestPath(start, end);
  res.status(200).json({ path });
};
