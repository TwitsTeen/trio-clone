import express, { type Request, type Response } from "express";
import Player from "../models/player";
import { findById, players } from "../services/playerService";
import { v4 as uuidv4 } from "uuid";
import { findRoomWithPlayer } from "../services/roomService";

const router = express.Router();

/**
 * This route registers a player
 */
router.post("/", (req: Request, res: Response) => {
  // Get playerId from cookies
  let playerId = req.cookies.playerId;

  // If playerId doesn't exist, create a new UUID and store it in a cookie
  if (!playerId) {
    playerId = uuidv4();
    res.cookie("playerId", playerId, {
      httpOnly: true,
    });
  }

  const name = req.body["name"];

  try {
    let player = new Player(name, playerId);
    players.push(player);

    res
      .status(200)
      .json({ message: "Player registered successfully", playerId: playerId });
  } catch (e) {
    res.status(500).json({
      message: "An error occurred while registering the player",
      error: e,
    });
  }
});

/**
 * This route deletes the currently registered player with this UUID
 */
router.delete("/", (req: Request, res: Response) => {
  const playerId = req.cookies.playerId;
  if (!playerId) {
    res.status(404).json({
      message: "No player ID found. Please register first.",
    });
    return;
  }

  const player = findById(playerId);
  if (player) {
    const room = findRoomWithPlayer(playerId);
    if (room) {
      res.status(403).json({
        message: "Player is in a room. Please leave the room first.",
      });
      return;
    }

    const index = players.indexOf(player);
    players.splice(index, 1);
    res.status(200).json({ message: "Player deleted successfully" });
  } else {
    res.status(404).json({
      message: "Unable to locate a player with this ID",
    });
  }
});

/**
 * This route shows the currently registered player with this UUID
 */
router.get("/", (req: Request, res: Response) => {
  const playerId = req.cookies.playerId;

  if (!playerId) {
    res.status(404).json({
      message: "No player ID found. Please register first.",
    });
    return;
  }

  const player = findById(playerId);
  if (player) {
    res.status(200).json({ player: player });
  } else {
    res.status(404).json({
      message: "Unable to locate a player with this ID",
    });
  }
});

export default router;
