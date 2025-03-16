const Card = ({ card }: { card: string }) => {
  return (
    <div className="border-2 rounded-2xl h-24 w-16 flex items-center justify-center hover:cursor-pointer hover:bg-accent-content">
      {card}
    </div>
  );
};

export default Card;
