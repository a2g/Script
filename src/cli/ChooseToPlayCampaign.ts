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
    const sessions = new AchievementSessionCollection();
    for (let achievement of Druids.achievements) {
      if(achievement.location)
      {
        const array = filenames.get(achievement.location);
        if(array)
        {
          array.push(achievement.piecesAddedUponActivation)
      }
      let location = locations.get(achievement.location);
      if (location !== undefined) {
        let box = new ReadOnlyJsonMultipleCombined(location.fileSet);
        let happener = new Happener(pileOfPieces);
        let s = new AchievementSession(happener, box.GetMapOfAllStartingThings(), box.CopyPiecesFromBoxToPile());
        s.prerequisiteAchievements = achievement.prerequisiteAchievements;
        s.prerequisiteType = achievement.prerequisiteType;
        s.achievementName = achievement.achievementName;
        s.achievementEnum = achievement.achievementEnum;
        s.sunsetAchievements = achievement.sunsetAchievements;
        s.sunsetType = achievement.sunsetType;
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
