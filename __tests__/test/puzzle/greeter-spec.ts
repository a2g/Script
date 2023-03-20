import { Greeter } from '../../../src/greeter.js';

test('Should greet with message', () => {
  const greeter = new Greeter('friend');
  expect(greeter.greet()).toBe('Bonjour, friend!');
});
