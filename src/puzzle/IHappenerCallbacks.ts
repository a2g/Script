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
  OnAchievementValueChange: (
    numberOfObjectWhoseVisibilityChanged: number,
    newValue: number,
    nameForDebugging: string
  ) => void
}
