import express, { type Request, type Response } from "express";
import { findById } from "../services/playerService";
import { findRoomWithPlayer } from "../services/roomService";

const router = express.Router();

/**
 * This route retrieves the current game status
 */
router.get("/", (req: Request, res: Response) => {
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
    const gameInfos = room.game?.getGameInfo(player);
    res.status(200).json({
      message: "Current game status",
      gameInfos: gameInfos,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "An error occured while starting the room", error: e });
  }
});

/**
 * This route reveals a card from the center or from an opponent
 */
router.post("/reveal", (req: Request, res: Response) => {
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
  if (!game) {
    res
      .status(404)
      .json({ message: "No game is currently being played in this room" });
  }

  if (game?.winner !== undefined) {
    res.status(400).json({ message: "The game is already finished" });
    return;
  }

  if (
    game?.players.findIndex((p) => p.id === player.id) !=
    game?.currentPlayerTurn
  ) {
    res.status(403).json({ message: "it's not your turn to play" });
    return;
  }

  const { cardIndex, source } = req.body;
  let card: number | undefined;
  if (source === "center") {
    card = game?.revealCenterCard(cardIndex);
  } else if (source === "opponent") {
    const { playerName, criteria } = req.body; // TODO this will cause issue if 2 player have the same name in the game

    if (criteria != "biggest" && criteria != "smallest") {
      res.status(400).json({ message: "Invalid criteria" });
    }

    const playerToReveal = game?.players.find((p) => p.name === playerName);
    if (!player) {
      res.status(404).json({ message: "The player hasn't been found" });
      return;
    }
    card = game?.revealPlayerCard(playerToReveal!, criteria);
  }

  if (!card) {
    res
      .status(500)
      .json({ message: "An error happened while retrieving the card" });
    return;
  }

  res.status(200).json({ message: "Card successfully revealed", card: card });
});

export default router;
