import { Happener } from '../puzzle/Happener.js';
import { PileOfPieces } from '../puzzle/PileOfPieces.js';
import { PlayerAI } from '../puzzle/PlayerAI.js';

export class Playable {
  private readonly player: PlayerAI;

  private readonly pileOfPieces: PileOfPieces;

  private readonly happener: Happener;

  private isCompleted: boolean;

  constructor(player: PlayerAI, happener: Happener, map: PileOfPieces) {
    this.player = player;
    this.pileOfPieces = map;
    this.happener = happener;
    this.isCompleted = false;
  }

  public GetPlayer(): PlayerAI {
    return this.player;
  }

  public GetPileOfPieces(): PileOfPieces {
    return this.pileOfPieces;
  }

  public GetHappener(): Happener {
    return this.happener;
  }

  public SetCompleted(): void {
    this.isCompleted = true;
  }

  public IsCompleted(): boolean {
    return this.isCompleted;
  }
}
