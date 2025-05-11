import { sum } from './sum';

it('should sum two number', () => {
  // Arrange
  const n1 = 10;
  const n2 = 20;
  // Act
  const result = n1 + n2;
  // Assert
  expect(sum(n1, n2)).toBe(30);
});
