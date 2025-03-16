import React from "react";

const RevealedCard = ({
  name,
  criteria,
  value,
}: {
  name: string;
  criteria: string;
  value: string;
}) => {
  return (
    <div className="border-2 rounded-2xl h-40 min-w-40 w-auto flex flex-col items-center justify-center space-y-2 p-2">
      <span className="text-lg font-semibold">{name}</span>
      <span className="text-sm text-primary-content">{value}</span>
      <span className="text-sm text-primary-content">{criteria} cards</span>
    </div>
  );
};

export default RevealedCard;
