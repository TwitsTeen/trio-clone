import { useState } from "react";
import Menu from "./Menu";
import Room from "./Room";
import Game from "./Game";

// Interface to define the structure of RoomData
interface RoomData {
  id: string;
  players: string[];
}

function App() {
  const [room, setRoom] = useState<RoomData | undefined>(undefined);
  const [isInGame, setIsInGame] = useState(false);
  const [playerName, setPlayerName] = useState("");
  if (!isInGame) {
    return (
      <div>
        <Menu
          setRoom={setRoom}
          setIsInGame={setIsInGame}
          setPlayerName={setPlayerName}
        ></Menu>
        {room === undefined ? (
          "Join a room to view this"
        ) : (
          <Room room={room} setIsInGame={setIsInGame} setRoom={setRoom}></Room>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <Game playerName={playerName}></Game>
      </div>
    );
  }
}

export default App;
