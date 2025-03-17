import { useState, useEffect } from "react";
import { serverUrl } from "./services/serverService";

export interface RoomData {
  id: string;
  players: string[];
}

interface MenuProps {
  setRoom: (room: RoomData) => void;
  setIsInGame: (isInGame: boolean) => void;
  setPlayerName: (playerName: string) => void;
}

export default function Menu({
  setRoom,
  setIsInGame,
  setPlayerName,
}: MenuProps) {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [serverPlayerName, setServerPlayerName] = useState<string | null>(null);

  useEffect(() => {
    // Check if the player already has an account
    getPlayerName();

    const fetchRoom = async () => {
      if (serverPlayerName != null) {
        await loadRoomInfo();
      }
    };
    if (serverPlayerName != null) {
      fetchRoom();
    }

    const interval = setInterval(fetchRoom, 10000);

    return () => clearInterval(interval);
  }, [serverPlayerName]);

  async function getPlayerName() {
    try {
      const response = await fetch(`${serverUrl}/players`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setServerPlayerName(result.player.name);
      setPlayerName(result.player.name);
    } catch (e) {
      console.error("Error making POST request:", e);
    }
  }

  async function handleCreateRoom() {
    try {
      const response = await fetch(`${serverUrl}/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const playerNames = result.room.players.map((player: any) => player.name); // TODO: Modify this on the server side
      setRoom({ id: result.room.id, players: playerNames });
    } catch (e) {
      console.error("Error making POST request:", e);
    }
  }

  async function register() {
    if (!name) {
      alert("Please enter a name!");
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      getPlayerName();
    } catch (e) {
      console.error("Error making POST request:", e);
    }
  }

  const handleJoinRoom = async () => {
    if (!roomCode) {
      alert("Please enter a room code");
      return;
    }

    if (!serverPlayerName) {
      alert("Please register or log in first.");
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/rooms/join/${roomCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const playerNames = result.room.players.map((player: any) => player.name);
      setRoom({ id: result.room.id, players: playerNames });
    } catch (e) {
      console.error("Error making POST request:", e);
    }
  };

  async function loadRoomInfo() {
    try {
      const response = await fetch(`${serverUrl}/rooms/current`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const playerNames = result.room.players.map((player: any) => player.name);
      if (result.room) {
        setRoom({ id: result.room.id, players: playerNames });
      }
      if (result.room.game) {
        setIsInGame(true);
      }
    } catch (e) {
      //console.error("Error making GET request:", e);
    }
  }

  async function disconnect() {
    try {
      const response = await fetch(`${serverUrl}/players`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      setServerPlayerName(null);
    } catch (e) {
      console.error("Error making DELETE request:", e);
    }
  }

  return (
    <>
      <div className="w-full h-auto flex p-4 bg-base-200">
        {!serverPlayerName ? (
          <>
            <input
              type="text"
              placeholder="Enter a name"
              className="input input-bordered input-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-primary" onClick={register}>
              Choose name
            </button>
          </>
        ) : (
          <div>
            <p>Welcome, {serverPlayerName || "Player"}!</p>
            <button className="btn btn-secondary" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        )}
      </div>
      <div className="w-full h-auto flex justify-between p-4 bg-base-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter room code"
            className="input input-bordered input-primary"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            disabled={!serverPlayerName}
          />
          <button
            className="btn btn-primary"
            onClick={handleJoinRoom}
            disabled={!serverPlayerName}
          >
            Join Room
          </button>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleCreateRoom}
          disabled={!serverPlayerName}
        >
          Create Room
        </button>
      </div>
    </>
  );
}
