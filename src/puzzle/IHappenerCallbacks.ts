export interface IHappenerCallbacks {
  OnPropVisbilityChange: (
    numberOfObjectWhoseVisibilityChanged: number,
    newValue: boolean,
    nameForDebugging: string
  ) => void
  OnInvVisbilityChange: (
    numberOfObjectWhoseVisibilityChanged: number,
    newValue: boolean,
    nameForDebugging: string
  ) => void
  OnGoalValueChange: (
    numberOfObjectWhoseVisibilityChanged: number,
    newValue: number,
    nameForDebugging: string
  ) => void
}
