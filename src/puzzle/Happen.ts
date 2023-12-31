/*
These are all the state changes that can occur
Possible new name: StateChangeEnum
*/
export enum Happen {
  InvGoes,
  InvStays,
  InvAppears,
  InvTransitionsToInv,

  PropGoes,
  PropStays,
  PropAppears,
  PropTransitionsToProp,

  GoalIsSet,
  GoalIsIncremented,
  GoalIsDecremented,
}
