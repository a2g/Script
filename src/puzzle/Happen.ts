/*
These are all the state changes that can occur
Possible new name: StateChangeEnum
*/
export enum Happen {
  InvGoes,
  InvStays,
  InvAppears,
  InvTransitions,

  PropGoes,
  PropStays,
  PropAppears,
  PropTransitions,

  AchievementIsSet,
  AchievementIsIncremented,
  AchievementIsDecremented,
}
