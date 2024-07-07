/*
These are all the state changes that can occur
Possible new name: StateChangeEnum
*/
export enum Happen {
  InvGoes,
  InvStays,
  InvAppears,
  InvTransitions,

  ObjGoes,
  ObjStays,
  ObjAppears,
  ObjTransitions,

  AchievementIsSet,
  AchievementIsIncremented,
  AchievementIsDecremented,
}
