import { RoomData } from "./Menu";
import { serverUrl } from "./services/serverService";

interface RoomProps {
  room: RoomData;
  setIsInGame: (isInGame: boolean) => void;
}

const Room = ({ room, setIsInGame }: RoomProps) => {
  async function startGame() {
    try {
      const response = await fetch(`${serverUrl}/rooms/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      setIsInGame(true);
    } catch (e) {
      console.error("Error making POST request:", e);
    }
  }

  async function leaveRoom() {
    try {
      const response = await fetch(`${serverUrl}/rooms/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      setIsInGame(false);
    } catch (e) {
      console.error("Error making POST request:", e);
    }
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={leaveRoom}>
        Leave Room
      </button>{" "}
      <br />
      Room id: {room.id}
      <br />
      Players
      {room.players.map((player, index) => (
        <div key={index}>{player}</div>
      ))}
      {room.players.length >= 3 && room.players.length <= 6 ? (
        <button className="btn btn-primary" onClick={startGame}>
          StartGame
        </button>
      ) : (
        "Not enough players to start"
      )}
    </div>
  );
};

export default Room;
