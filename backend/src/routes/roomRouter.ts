import express, { type Request, type Response } from "express";
import { findById } from "../services/playerService";
import Room from "../models/room";
import {
  findRoomById,
  findRoomWithPlayer,
  rooms,
} from "../services/roomService";

const router = express.Router();

/**
 * This route creates a new room
 */
router.post("/create", (req: Request, res: Response) => {
  let playerId = req.cookies.playerId;

  const player = findById(playerId);
  if (player === undefined) {
    res.json({ message: "Please register before creating a room" });
    return;
  }
  const room = new Room();
  room.players.push(player);
  rooms.push(room);
  res.json({ message: "Room created successfully", room: room });
});

/**
 * This route joins a room
 */
router.post("/join/:id", (req: Request, res: Response) => {
  const id = req.params.id ? req.params.id : "0";

  if (id === "0") {
    res.json({ message: "Please enter a valid room id" });
  }

  let playerId = req.cookies.playerId;
  const player = findById(playerId);

  if (player === undefined) {
    res.json({ message: "Please register before joining a room" });
    return;
  }

  const room = findRoomById(id);
  if (!room) {
    res.json({ message: "There are no room with that id" });
    return;
  }

  if (room.players.some((p) => p.id === playerId)) {
    return res.json({ message: "Player already in the room" });
  }
  room.players.push(player);
  res.json({ message: "Successfully joined the room", room: room });
});

/**
 * This route leaves a room
 */
router.post("/leave", (req: Request, res: Response) => {
  let playerId = req.cookies.playerId;

  if (!playerId) {
    res.status(400).json({ message: "Player ID not found in cookies" });
    return;
  }
  const player = findById(playerId);

  if (player === undefined) {
    res.status(404).json({ message: "No player with that ID" });
    return;
  }

  const room = findRoomWithPlayer(playerId);
  if (!room) {
    res.status(404).json({ message: "The user is not in a room" });
    return;
  }

  const game = room.game;
  if (game) {
    res
      .status(403)
      .json({ message: "Cannot leave a room while a game is in progress" });
    return;
  }

  const index = room.players.findIndex((p) => p.id === playerId);
  room.players.splice(index, 1);

  // Delete the room if there are no players left
  if (room.players.length === 0) {
    const roomIndex = rooms.indexOf(room);
    rooms.splice(roomIndex, 1);
  }

  res.json({ message: "Successfully left the room" });
});

/**
 * This route gets the current room of the player
 */
router.get("/current", (req: Request, res: Response) => {
  let playerId = req.cookies.playerId;

  if (!playerId) {
    res.status(400).json({ message: "Player ID not found in cookies" });
    return;
  }
  const player = findById(playerId);

  if (player === undefined) {
    res.json({ message: "No player with that ID" });
    return;
  }

  const room = findRoomWithPlayer(playerId);
  if (!room) {
    res.json({ message: "The user is not in a room" });
    return;
  }

  res.status(200).json({ message: "Found the player in a room", room: room });
});

/**
 * This route starts the game
 */
router.post("/start", (req: Request, res: Response) => {
  let playerId = req.cookies.playerId;

  if (!playerId) {
    res.status(400).json({ message: "Player ID not found in cookies" });
    return;
  }
  const player = findById(playerId);

  if (player === undefined) {
    res.status(404).json({ message: "No player with that ID" });
    return;
  }

  const room = findRoomWithPlayer(playerId);
  if (!room) {
    res.status(404).json({ message: "The user is not in a room" });
    return;
  }

  try {
    room.start();
    res.status(200).json({ message: "Starting the game" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "An error occured while starting the room", error: e });
  }
});

export default router;
