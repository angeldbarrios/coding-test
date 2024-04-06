const countGoodSquaresV1 = require('./countGoodSquaresV1');
const countGoodSquaresV2 = require('./countGoodSquaresV2');

function generateMatrix(size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(Math.floor(Math.random() * 2));
        }
        matrix.push(row);
    }
    return matrix;
}

function execCountGoodSquaresV1(matrix) {
    const startv1 = new Date().getTime();
    const result = countGoodSquaresV1(matrix);
    console.log(`Execution time v1: ${new Date().getTime() - startv1}ms`);
    console.log(`countGoodSquaresV1 found ${result} good squares`);
}

function execCountGoodSquaresV2(matrix) {
    const startv2 = new Date().getTime();
    const result = countGoodSquaresV2(matrix);
    console.log(`Execution time v2: ${new Date().getTime() - startv2}ms`);
    console.log(`countGoodSquaresV2 found ${result} good squares`);
}


function main() {
    const matrixSize = 1000;
    const matrix = generateMatrix(matrixSize);

    execCountGoodSquaresV1(matrix);
    execCountGoodSquaresV2(matrix);
}

main();