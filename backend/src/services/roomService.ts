import type Room from "../models/room";

export const rooms: Room[] = [];

export function getNextRoomId() {
  if (rooms.length === 0) {
    return "1";
  }
  return (+rooms[rooms.length - 1]!.id + 1).toString();
}

export function findRoomById(roomId: string) {
  return rooms.find((room) => room.id === roomId);
}

export function findRoomWithPlayer(playerId: string) {
  return rooms.find((room) =>
    room.players.some((player) => player.id === playerId)
  );
}

export function deleteRoom(roomId: string) {
  const index = rooms.findIndex((room) => room.id === roomId);
  rooms.splice(index, 1);
}
