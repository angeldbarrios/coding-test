const countGoodSquaresV1 = require('./countGoodSquaresV1');
const countGoodSquaresV2 = require('./countGoodSquaresV2');

describe('countGoodSquares', () => {
  describe.each([
    {
      name: 'countGoodSquaresV1',
      fn: countGoodSquaresV1
    },
    {
      name: 'countGoodSquaresV2',
      fn: countGoodSquaresV2
    }
  ])('$name', ({ fn: countGoodSquaresFn }) => {
    it('should return 0 for empty matrix', () => {
      const matrix = [];
      expect(countGoodSquaresFn(matrix)).toBe(0);
    });

    describe('1x1 matrix', () => {
      it('should return 0 for matrix with 0', () => {
        const matrix = [[0]];
        expect(countGoodSquaresFn(matrix)).toBe(0);
      });

      it('should return 1 for matrix with 1', () => {
        const matrix = [[1]];
        expect(countGoodSquaresFn(matrix)).toBe(1);
      });
    });

    describe('2x2 matrix', () => {
      it('should return 0 for matrix with no good squares', () => {
        const matrix = [
          [0, 0],
          [0, 0]
        ];
        expect(countGoodSquaresFn(matrix)).toBe(0);
      });

      it('should return 3 for 2x2 matrix filled with three 1s', () => {
        const matrix = [
          [1, 1],
          [0, 1]
        ];
        expect(countGoodSquaresFn(matrix)).toBe(3);
      });
    });

    describe('3x3 matrix', () => {
      it('should return 0 for 3x3 matrix with 0s', () => {
        const matrix = [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ];
        expect(countGoodSquaresFn(matrix)).toBe(0);
      });

      it('should count good squares for 3x3 matrix filled with 1s', () => {
        const matrix = [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1]
        ];
        expect(countGoodSquaresFn(matrix)).toBe(14);
      });

      it('should count good squares for 3x3 matrix filled with 1s, except one 0 in the center', () => {
        const matrix = [
          [1, 1, 1],
          [1, 0, 1],
          [1, 1, 1]
        ];
        expect(countGoodSquaresFn(matrix)).toBe(8);
      });

      it('should count good squares for 3x3 matrix filled with 1s, except one 0 in the bottom right corner', () => {
        const matrix = [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 0]
        ];
        expect(countGoodSquaresFn(matrix)).toBe(11);
      });

      it('should count good squares for 3x3 matrix filled with 1s, except one 0 in the top right corner', () => {
        const matrix = [
          [1, 1, 0],
          [1, 1, 1],
          [1, 1, 1]
        ];
        expect(countGoodSquaresFn(matrix)).toBe(11);
      });
    });

    describe('10x10 matrix', () => {
      it('should count good squares for 10x10 matrix filled with 1s, except one 0 in the center', () => {
        const matrix = Array.from({ length: 10 }, () => Array(10).fill(1));
        matrix[5][5] = 0;
        expect(countGoodSquaresFn(matrix)).toBe(275);
      });

      it('should count good squares for 10x10 matrix filled with 1s, except one 0 in the bottom right corner', () => {
        const matrix = Array.from({ length: 10 }, () => Array(10).fill(1));
        matrix[9][9] = 0;
        expect(countGoodSquaresFn(matrix)).toBe(375);
      });

      it('should count good squares for 10x10 matrix filled with 0s and some 1s', () => {
        const matrix = [
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
        ];
        expect(countGoodSquaresFn(matrix)).toBe(50);
      });
    });
  });
});