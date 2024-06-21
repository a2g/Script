import { expect, test } from '@jest/globals'
import { ChoiceSection } from '../../../../src/puzzle/chat/ChoiceSection'

test('FindMostNearlyCompleteRowOrColumnCombined', () => {
  const choiceSection = new ChoiceSection('file', 'key')
  expect(choiceSection.file).toEqual('file')
})

// Ensure GetAllChatingWhilstChoosing adds the choosers speech, ie you

// Ensure GetAllChatingWhilstChoosing only adds the first match - not nay others

// Ensure GetAllChatingWhilstChoosing uses up the top item in the array.
