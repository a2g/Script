
export function IsAGoalMetPieceType (type: string): boolean {
  return type.startsWith('TALK_GAINS_GOAL1') ||
    type.startsWith('AUTO_GOAL1_MET') ||
    type.startsWith('GOAL1_MET')
}
