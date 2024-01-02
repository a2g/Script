import { GameReporter } from './GameReporter'

export class Game {
  public static instance: Game | null

  public static GetInstance (): Game {
    if (Game.instance == null) {
      Game.instance = new Game()
    }
    return Game.instance
  }
  /*
  public Show(itemName: string) {
      GameRuleEnforcer.GetInstance().ShowOrHide(itemName, true);
      GameReporter.GetInstance().Show(itemName);
      //if its an inventory, then we say
  }

  public Hide(itemName: string) {
      GameRuleEnforcer.GetInstance().ShowOrHide(itemName, false);
      // could be just an object transformation, so don't say anything.
  } */

  public Say (speech: string): void {
    // enforcer's don't care about saying stuff som much.
    // this.enforcer.Say(itemName);
    GameReporter.GetInstance().Say(speech)
  }
}
