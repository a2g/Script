/* 
import Campaign from '../../practice-world/Campaign.jsonc';
import { Area } from './Area';

export function ChooseToPlayCampaign(): void {
  const filenames = new Map<string, string[]>();
  const locations = new Map<string, Area>();
  for (const incoming of Campaign.areas) {
    const location = new Area();
    location.areaName = incoming.locationName;
    location.areaEnum = incoming.locationEnum;

    locations.set(location.areaName, location);
    const array: string[] = [];
    array.push(incoming.firstBoxFile);

    location.fileSet.push(incoming.firstBoxFile);
    for (const file of incoming.extraFiles) {
      location.fileSet.push(file);
      array.push(file);
    }
    filenames.set(incoming.locationEnum, array);
  }
  /*
    const sessions = new GoalSessionCollection();
    for (let goal of Druids.goals) {
      if(goal.location)
      {
        const array = filenames.get(goal.location);
        if(array)
        {
          array.push(goal.piecesAddedUponActivation)
      }
      let location = locations.get(goal.location);
      if (location !== undefined) {
        let box = new ReadOnlyJsonMultipleCombined(location.fileSet);
        let happener = new Happener(box);
        let s = new GoalSession(happener, box.GetMapOfAllStartingThings(), box.CopyPiecesFromBoxToPile());
        s.prerequisiteGoals = goal.prerequisiteGoals;
        s.prerequisiteType = goal.prerequisiteType;
        s.goalName = goal.goalName;
        s.goalEnum = goal.goalEnum;
        s.sunsetGoals = goal.sunsetGoals;
        s.sunsetType = goal.sunsetType;
        sessions.Push(s);
      }
    }

    while (true) {
      // list the sections to choose from
      for (let i = 0; i < sessions.Length(); i++) {
        let book = sessions.Get(i);
        console.warn("" + i + ". " + book.GetTitle() + (sessions.IsActive(i) ? "  active" : "  locked") + (book.playable.IsCompleted() ? "  COMPLETE!" : "  incomplete"));
      }

      // ask which section they want to play?
      const choice = prompt("Choose an option or (b)ack: ").toLowerCase();
      if (choice == 'b')
        break;// break the while(true);
      const number = Number(choice);
      if (number < 0 || number >= sessions.Length()) {
        console.warn("out-of-range");
        break;
      }

      // now play the book
      const session = sessions.Get(number);
      PlayPlayable(session.playable);

    }// end while true of selecting a section
  
}
*/
