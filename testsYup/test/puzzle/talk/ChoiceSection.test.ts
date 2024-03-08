import { expect, test } from '@jest/globals'
import { ChoiceSection } from '../../../../src/puzzle/talk/ChoiceSection'

test('FindMostNearlyCompleteRowOrColumnCombined', () => {
  const choiceSection = new ChoiceSection('file', 'key')
  expect(choiceSection.file).toEqual('file')
})

// Ensure GetAllTalkingWhilstChoosing adds the choosers speech, ie you

// Ensure GetAllTalkingWhilstChoosing only adds the first match - not nay others

// Ensure GetAllTalkingWhilstChoosing uses up the top item in the array.
