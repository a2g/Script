import { Colors } from '../puzzle/Colors';
import { FormatText } from '../puzzle/FormatText';

export class GameReporter {
  private static instance: GameReporter | null = null;

  public static GetInstance(): GameReporter {
    if (GameReporter.instance == null) {
      GameReporter.instance = new GameReporter();
    }
    return GameReporter.instance;
  }

  private numberOfCommandsExecuted: number;
  constructor() {
    this.numberOfCommandsExecuted = 0;
  }

  public Show(itemName: string): void {
    if (itemName.startsWith('i')) {
      console.warn(
        'You now have a ' + FormatText(itemName) + ' in your possession'
      );
    } else if (itemName.startsWith('o')) {
      console.warn('A ' + FormatText(itemName) + ' reveals itself');
    }
  }

  public Say(speech: string): void {
    console.warn('Main character says ' + this.Speech(speech));
  }

  public ReportCommand(command: string[]): void {
    this.numberOfCommandsExecuted++;

    let prettifiedCommand = '';
    if (command.length !== 3) {
      prettifiedCommand =
        Colors.Red + 'Command length is not 3!' + Colors.Reset;
    } else if (command[2] !== '') {
      prettifiedCommand =
        this.Prettify(command[0]) +
        ' ' +
        this.Prettify(command[1]) +
        ' with ' +
        this.Prettify(command[2]);
    } else if (command[1] !== '') {
      prettifiedCommand =
        this.Prettify(command[0]) + ' ' + this.Prettify(command[1]);
    } else {
      prettifiedCommand = this.Prettify(command[0]);
    }

    console.warn('\n');
    console.warn(`> #${this.numberOfCommandsExecuted} ${prettifiedCommand}`);
    console.warn('\n');
  }

  public ReportInventory(inventoryItems: string[]): void {
    if (inventoryItems.length === 0) {
      return console.warn("You aren't carrying anything");
    }

    let inventoryString: string =
      'You are carrying: ' + FormatText(inventoryItems[0]);
    for (let i = 1; i < inventoryItems.length; i++) {
      // classic forloop useful because starting at 1
      inventoryString += ', ' + FormatText(inventoryItems[i]);
    }

    console.warn(inventoryString);
  }

  public ReportScene(sceneItems: string[]): void {
    if (sceneItems.length === 0) {
      return console.warn("There's nothing around you");
    }

    let sceneString: string = 'You can see: ' + FormatText(sceneItems[0]);
    for (let i = 1; i < sceneItems.length; i++) {
      // classic forloop useful because starting at 1
      sceneString += ', ' + FormatText(sceneItems[i]);
    }

    console.warn(sceneString);
  }

  public ReportGoals(goals: string[]): void {
    if (goals.length === 0) {
      return console.warn('No goals have been set');
    }

    let sceneString: string = 'Non zero goals: ' + FormatText(goals[0]);
    for (let i = 1; i < goals.length; i++) {
      // classic forloop useful because starting at 1
      sceneString += ', ' + FormatText(goals[i]);
    }

    console.warn(sceneString);
  }

  private Prettify(itemName: string): string {
    return FormatText(itemName);
  }

  private Speech(speech: string): string {
    return '' + Colors.Blue + '"' + speech + '"' + Colors.Reset;
  }
}
