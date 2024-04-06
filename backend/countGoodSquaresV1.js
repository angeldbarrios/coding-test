/**
 * Counts the total number of 'good squares' in a  matrix.
 * A 'good square' is defined as a mXm matrix (submatrix) where all elements are 1.
 * 
 * @param {number[][]} A - The matrix (n x n) to evaluate.
 * @returns {number} The total count of 'good squares' in the matrix.
 */
function countGoodSquares(A) {
  const n = A.length;
  if (n === 0) return 0;

  const squareSizeMap = Array.from({ length: n }, () => Array(n).fill(0));
  let totalSquares = 0;

  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      if (A[x][y] === 1) {
        if (x === 0 || y === 0) {
          // If the current element is at the top or left edge of the matrix,
          // the maximum square size that can be formed at this point is 1.
          squareSizeMap[x][y] = 1;
        } else {
          // Calculate the maximum possible square size that can be formed at this point.
          // Based on the minimum of the adjacent squares (above, left, and diagonal left above)
          // values stored in the squareSizeMap.

          // Example:
          // [otherValue, otherValue, otherValue]
          // [valueDiagonalLeftAbove, valueAbove]
          // [valueLeft, currentvalue]

          const valueAbove = squareSizeMap[x - 1][y];
          const valueLeft = squareSizeMap[x][y - 1];
          const valueDiagonalLeftAbove = squareSizeMap[x - 1][y - 1];

          const smallestAdjacentSquare = Math.min(
            valueAbove,
            valueLeft,
            valueDiagonalLeftAbove
          );
          const maximumPossibleSquareSize = 1 + smallestAdjacentSquare;
          squareSizeMap[x][y] = maximumPossibleSquareSize;
        }
        totalSquares += squareSizeMap[x][y];
      }
    }
  }
  return totalSquares;
}

module.exports = countGoodSquares;