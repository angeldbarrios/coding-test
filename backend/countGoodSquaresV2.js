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

    let totalSquares = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (A[i][j] === 1) {
                totalSquares++;
                const remainingRows = n - i;
                const remainingCols = n - j;

                // The maximum square size that can fit in the remaining rows and columns.
                const maxSquareSize = Math.min(remainingRows, remainingCols);

                // Check for larger squares
                // starting from 2x2 to maxSquareSize x maxSquareSize
                // based on the remaining rows and columns.
                for (let k = 2; k <= maxSquareSize; k++) {
                    let isGoodSquare = true;
                    for (let ii = i; ii < i + k; ii++) {
                        for (let jj = j; jj < j + k; jj++) {
                            if (ii === i && jj === j) continue;
                            if (A[ii][jj] !== 1) {
                                isGoodSquare = false;
                                break;
                            }
                        }
                        if (!isGoodSquare) {
                            // if a good square is not found in the current row
                            // there is no need to check the remaining rows.
                            break
                        };
                    }

                    if (isGoodSquare) {
                        totalSquares++;
                    } else {
                        // If the current square is not good
                        // there is no need to check for larger squares.
                        break;
                    }
                }
            }
        }

    }
    return totalSquares;
}

module.exports = countGoodSquares;