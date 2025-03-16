import type Player from "../models/player";

export const players: Player[] = [];

export function findById(playerId: String) {
  const player = players.find((player) => player.id === playerId);
  return player;
}
