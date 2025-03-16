const OtherPlayerCardInfo = ({
  name,
  numberOfCards,
  revealOtherPlayerCard,
}: {
  name: string;
  numberOfCards: number;
  revealOtherPlayerCard: (
    criteria: "biggest" | "smallest",
    playerName: string
  ) => Promise<void>;
}) => {
  return (
    <div className="border-2 rounded-2xl h-40 min-w-40 w-auto flex flex-col items-center justify-center space-y-2 p-2">
      <span className="text-lg font-semibold">{name}</span>
      <span className="text-sm text-primary-content">
        {numberOfCards} cards
      </span>
      <button
        className="bg-primary text-white text-xs py-1 px-2 rounded-lg hover:cursor-pointer"
        onClick={() => revealOtherPlayerCard("biggest", name)}
      >
        Biggest
      </button>
      <button
        className="bg-secondary text-white text-xs py-1 px-2 rounded-lg hover:cursor-pointer"
        onClick={() => revealOtherPlayerCard("smallest", name)}
      >
        Smallest
      </button>
    </div>
  );
};

export default OtherPlayerCardInfo;
