import { Happener } from '../puzzle/Happener';
import { PileOfPieces } from '../puzzle/PileOfPieces';
import { PlayerAI } from '../puzzle/PlayerAI';

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
