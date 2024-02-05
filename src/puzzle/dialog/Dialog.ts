import { ChoicePage } from "./ChoicePage"
import { NonChoicePage } from "./NonChoicePage"

export class Dialog {
  choices: Map<string, ChoicePage>
  nonChoices: Map<String, NonChoicePage>

  constructor() {
    this.choices = new Map<string, ChoicePage>()
    this.nonChoices = new Map<string, NonChoicePage>()
  }

  AddChoice(choice: ChoicePage): void {
    this.choices.set(choice.GetKey(), choice)
  }

  AddNonChoice(nonChoice: NonChoicePage): void {
    this.nonChoices.set(nonChoice.GetKey(), nonChoice)
  }
}