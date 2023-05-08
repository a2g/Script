import { AddBrackets } from './AddBrackets';
import { FormatText } from './FormatText';
import { Raw } from './Raw';

export class RawObjectsAndVerb {
  public type: Raw;
  public objectA: string;
  public objectB: string;
  public startingCharacterForA: string;
  public startingCharacterForB: string;
  public restrictions: string[];
  public typeJustForDebugging: string;

  constructor(
    type: Raw,
    objectA: string,
    objectB: string,
    restrictions: string[],
    typeJustForDebugging: string
  ) {
    this.type = type;
    this.objectA = objectA;
    this.objectB = objectB;
    this.startingCharacterForA = '';
    this.startingCharacterForB = '';
    this.restrictions = restrictions;
    this.typeJustForDebugging = typeJustForDebugging;
  }

  public AsDisplayString(isColor: boolean = true): string {
    const enumAsInt = parseInt(this.type.toString(), 10);
    if (enumAsInt >= 0) {
      const verb = FormatText(Raw[enumAsInt], isColor);
      const objectA =
        FormatText(this.objectA, isColor) +
        FormatText(this.startingCharacterForA, isColor, true);
      if (this.objectB === undefined) {
        this.dumpRaw();
      }
      const objectB =
        FormatText(this.objectB, isColor) +
        FormatText(this.startingCharacterForB, isColor, true);

      const restriction =
        this.restrictions.length > 0
          ? AddBrackets(FormatText(this.restrictions, isColor))
          : '';
      let joiner = ' ';
      switch (enumAsInt) {
        case Raw.Use:
          joiner = ' with ';
          break;
        case Raw.Toggle:
          joiner = ' to ';
          break;
        case Raw.Auto:
          joiner = ' becomes ';
          break;
      }
      return verb + ' ' + objectA + joiner + objectB + ' ' + restriction;
    } else {
      return 'Raw type was invalid';
    }
  }

  public appendStartingCharacterForA(startingCharacterForA: string): void {
    if (this.startingCharacterForA.length > 0) {
      this.startingCharacterForA += ', ' + startingCharacterForA;
    } else {
      this.startingCharacterForA = startingCharacterForA;
    }
  }

  public appendStartingCharacterForB(startingCharacterForB: string): void {
    if (this.startingCharacterForB.length > 0) {
      this.startingCharacterForB += ', ' + startingCharacterForB;
    } else {
      this.startingCharacterForB = startingCharacterForB;
    }
  }

  public dumpRaw(): void {
    console.warn('Dumping instance of RawObjectsAndVerb');
    console.warn(Raw[this.type]);
    console.warn(this.objectA);
    console.warn(this.objectB);
  }

  public isAGoalOrAuto(): boolean {
    return this.type === Raw.Goal 
    || this.type == Raw.Auto
    || this.type == Raw.PenultimateStep;
  }
}
