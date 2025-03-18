import { useEffect, useState } from "react";
import { serverUrl } from "./services/serverService";
import Card from "./Card";
import OtherPlayerCardInfo from "./OtherPlayerCardInfo";
import RevealedCard from "./RevealedCard";

interface RevealedCard {
  card: number;
  criteria: string;
  player: string;
}

interface GameInfo {
  players: String[]; // The list of player's name in the lobby
  numberOfCenterCards: number; // The number of cards in the center
  playerCards: number[]; // The list of cards for the player that requested the game
  playerPoints: Record<string, number>; // The list of points for each player, indexed by the player's name
  currentPlayerTurn: number; // The index of the player in the players array
  revealedCards: RevealedCard[]; // The list of revealed cards
  revealedCenterCards: Record<number, number>; // The list of revealed center cards, indexed by the card index
  winner: string | undefined; // The name of the winner
  cardsRemaining: Record<string, number>; // The number of cards remaining for each player
}

export default function Game({ playerName }: { playerName: string }) {
  const [gameInfo, setGameInfo] = useState<GameInfo | undefined>(undefined);

  const isItYourTurn = (): boolean => {
    if (
      gameInfo?.revealedCards.length === 2 &&
      gameInfo?.revealedCards[0].card != gameInfo?.revealedCards[1].card
    )
      return false;
    const playerIndex = gameInfo?.players.findIndex(
      (player) => player === playerName
    );
    return playerIndex !== -1 && gameInfo?.currentPlayerTurn === playerIndex;
  };

  const revealMiddleCard = async (index: number): Promise<void> => {
    if (!isItYourTurn()) {
      console.log("It's not your turn!");
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/games/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cardIndex: index, source: "center" }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log(result.revealedCard);
    } catch (e) {
      console.error("Error making POST request:", e);
    }
  };

  const revealOtherPlayerCard = async (
    criteria: "biggest" | "smallest",
    playerName: string
  ): Promise<void> => {
    if (!isItYourTurn()) {
      console.log("It's not your turn!");
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/games/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ source: "opponent", playerName, criteria }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
    } catch (e) {
      console.error("Error making POST request:", e);
    }
  };

  const fetchGameInfo = async (): Promise<void> => {
    try {
      const response = await fetch(`${serverUrl}/games`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      setGameInfo(result.gameInfos);
    } catch (e) {
      console.error("Error making GET request:", e);
    }
  };

  useEffect(() => {
    const fetchData = async () => await fetchGameInfo();

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameInfo?.winner) {
      const modal = document.getElementById("my_modal_1");
      (modal as HTMLDialogElement)?.showModal();
    }
  }, [gameInfo?.winner]);

  return (
    <div>
      {gameInfo ? (
        <div>
          <h2>
            {isItYourTurn()
              ? "It's your turn!"
              : "Waiting for other players..."}
          </h2>

          <h2>Center Cards:</h2>
          <ul className="flex gap-2 mx-auto items-center justify-center">
            {Array.from({ length: gameInfo.numberOfCenterCards }).map(
              (_, index) => {
                if (
                  Object.entries(gameInfo.revealedCenterCards).find(
                    ([card]) => Number(card) === index
                  )
                ) {
                  return (
                    <li key={index}>
                      <Card
                        card={
                          Object.entries(gameInfo.revealedCenterCards)
                            .find(([card]) => Number(card) === index)?.[1]
                            .toString() || "?"
                        }
                        isClickable={false}
                      />
                    </li>
                  );
                } else {
                  return (
                    <li key={index} onClick={() => revealMiddleCard(index)}>
                      <Card card="?" isClickable={isItYourTurn()} />
                    </li>
                  );
                }
              }
            )}
          </ul>

          <h2>Cards Remaining:</h2>
          <ul className="flex gap-2 mx-auto items-center justify-center">
            {Object.entries(gameInfo.cardsRemaining).map(([name, count]) => (
              <li key={name}>
                <OtherPlayerCardInfo
                  name={name}
                  numberOfCards={count}
                  revealOtherPlayerCard={revealOtherPlayerCard}
                  isClickable={isItYourTurn()}
                />
              </li>
            ))}
          </ul>

          <h2>Your cards:</h2>
          <ul className="flex gap-2 mx-auto items-center justify-center">
            {gameInfo.playerCards.map((card, index) => (
              <li key={index}>
                <Card card={card.toString()} isClickable={false} />
              </li>
            ))}
          </ul>

          <h2>Revealed Cards:</h2>
          <ul className="flex gap-2 mx-auto items-center justify-center">
            {gameInfo.revealedCards.map((card, index) => (
              <li key={index}>
                <RevealedCard
                  name={card.player}
                  value={card.card.toString()}
                  criteria={card.criteria}
                />
              </li>
            ))}
          </ul>

          <h2>Players points:</h2>
          <ul className="flex gap-2 mx-auto items-center justify-center">
            {Object.entries(gameInfo.playerPoints).map(
              ([player, points], index) => (
                <li key={index}>
                  {player}: {points}
                </li>
              )
            )}
          </ul>

          {/* The modal */}
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">
                The winner of the game is:{" "}
                {gameInfo.winner ? gameInfo.winner : "No winner yet!"}
              </p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      ) : (
        <p>Loading game information...</p>
      )}
    </div>
  );
}
