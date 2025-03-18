import { deleteRoom, getNextRoomId } from "../services/roomService";
import Game from "./game";
import type Player from "./player";

export interface RoomData {
  id: string;
  players: string[];
  isInGame: boolean;
}

export default class Room {
  id: string;
  players: Player[];
  game: Game | undefined;

  constructor() {
    this.players = [];
    const nextId = getNextRoomId();
    this.id = nextId ? nextId : "0"; // There shouldn't be any case where nextId is undefined or null though i need to make the ts compiler happy
  }

  getRoomData(): RoomData {
    return {
      id: this.id,
      players: this.players.map((player) => player.name),
      isInGame: this.game !== undefined,
    };
  }

  start() {
    if (this.players.length >= 3 && this.players.length <= 6)
      this.game = new Game(this.players, this.closeRoom.bind(this));
    else throw new Error("Not enough or too much players to start the game");
  }

  closeRoom() {
    deleteRoom(this.id);
  }
}
