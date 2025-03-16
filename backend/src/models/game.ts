import type Player from "./player";

interface RevealedCard {
  card: number;
  criteria: string;
  player: string;
}

const CARD_DISTRIBUTION = {
  3: { perPlayer: 9, center: 9 },
  4: { perPlayer: 7, center: 8 },
  5: { perPlayer: 6, center: 5 },
  6: { perPlayer: 5, center: 6 },
} as const;

export default class Game {
  players: Player[];
  number_center_cards: number;
  number_cards_per_player: number;
  playerCards: Map<Player, number[]> = new Map();
  playerPoints: Map<Player, number> = new Map();
  centerCards: number[] = [];
  deck: number[];
  currentPlayerTurn = 0;
  revealedCards: RevealedCard[] = [];
  revealedCenterCards: Map<number, number> = new Map();
  winner: string | undefined;
  closeRoom: () => void;

  constructor(players: Player[], closeRoom: () => void) {
    this.closeRoom = closeRoom;
    const config =
      CARD_DISTRIBUTION[players.length as keyof typeof CARD_DISTRIBUTION];
    if (!config) throw new Error("Invalid player amount");

    this.players = players;
    this.number_cards_per_player = config.perPlayer;
    this.number_center_cards = config.center;
    this.deck = this.generateDeck();

    this.dealCards();
    this.initPlayerPoints();
  }

  initPlayerPoints(): void {
    this.players.forEach((player) => this.playerPoints.set(player, 0));
  }

  private generateDeck(): number[] {
    return Array.from({ length: 12 }, (_, i) => i + 1).flatMap((n) => [
      n,
      n,
      n,
    ]);
  }

  private shuffleDeck(): void {
    this.deck.sort(() => Math.random() - 0.5);
  }

  private dealCards(): void {
    this.shuffleDeck();
    this.players.forEach((player) => {
      const hand = this.deck.splice(0, this.number_cards_per_player);
      this.playerCards.set(player, hand);
    });
    this.centerCards = this.deck.splice(0, this.number_center_cards);
    this.sortCards();
  }

  private sortCards(): void {
    this.playerCards.forEach((cards) => cards.sort((a, b) => a - b));
  }

  revealCenterCard(cardIndex: number): number | undefined {
    const card = this.centerCards[cardIndex];
    if (card === undefined) throw new Error("Invalid card index");
    this.revealedCards.push({
      card,
      criteria: cardIndex.toString(),
      player: "center",
    });
    this.checkRevealedCards();
    return card;
  }

  addRevealedCenterCard(cardIndex: number, cardValue: number): void {
    this.revealedCenterCards.set(cardIndex, cardValue);
  }

  revealPlayerCard(player: Player, criteria: "biggest" | "smallest"): number {
    const [card1, card2, card3] = this.revealedCards.map((r) => r.card);
    if (this.revealedCards.length >= 3 && card1 !== card2) {
      return -1;
    }
    const hand = this.playerCards.get(player);
    if (!hand || hand.length === 0)
      throw new Error("No cards found for the player");

    const card = criteria === "biggest" ? Math.max(...hand) : Math.min(...hand);

    this.removePlayerCard(player, card);
    this.revealedCards.push({ card, criteria, player: player.name });
    this.checkRevealedCards();
    return card;
  }

  private removePlayerCard(player: Player, card: number): void {
    const hand = this.playerCards.get(player);
    if (!hand) throw new Error("Player not found");

    const index = hand.indexOf(card);
    if (index === -1) throw new Error("Card not found in player's hand");

    hand.splice(index, 1);
  }

  private putBackRevealedCards(): void {
    this.revealedCards.forEach(({ card, player }) => {
      const playerObj = this.players.find((p) => p.name === player);
      this.playerCards.get(playerObj!)?.push(card);
    });
    this.revealedCards = [];
  }

  private nextPlayerTurn(): void {
    this.currentPlayerTurn = (this.currentPlayerTurn + 1) % this.players.length;
  }

  private async checkRevealedCards(): Promise<void> {
    this.sortCards();
    const [card1, card2, card3] = this.revealedCards.map((r) => r.card);
    if (this.revealedCards.length >= 3 && card1 !== card2) {
      this.putBackRevealedCards();
      return;
    }

    if (this.revealedCards.length === 2 && card1 !== card2) {
      await this.delay(4000);
      this.putBackRevealedCards();
      this.nextPlayerTurn();
    }

    if (this.revealedCards.length === 3) {
      if (card1 === card2 && card1 === card3) {
        for (let card of this.revealedCards) {
          if (card.player === "center") {
            this.addRevealedCenterCard(parseInt(card.criteria), card.card);
          }
        }
        this.revealedCards = [];
        this.playerPoints.set(
          this.players[this.currentPlayerTurn]!,
          this.playerPoints.get(this.players[this.currentPlayerTurn]!)! + 1
        );

        if (
          this.playerPoints.get(this.players[this.currentPlayerTurn]!) === 3
        ) {
          console.log(`${this.players[this.currentPlayerTurn]!.name} wins`);
          this.winner = this.players[this.currentPlayerTurn]!.name;
          await this.delay(10000);
          this.closeRoom();
          return;
        }
        this.sortCards();
        this.nextPlayerTurn();
      } else {
        await this.delay(4000);
        this.putBackRevealedCards();
        this.nextPlayerTurn();
      }
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
