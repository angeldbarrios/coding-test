### Getting started
Download dependencies (just Jest)
````
npm install
````

### Run tests
````
npm run test
````

### Description
We are given a 0-1 matrix A, nXn, n < 1000.
A good square in A is an mXm matrix all whose entries are 1s.
Count the number of good squares in A.

#### Example 1:
````
111
111
111
````
Answer: 9 (1X1) + 4 (2X2) + 1(3X3) = 14

#### Example 2:
````
111
101
111
````
Answer: 8 (1X1) = 8

#### Example 3:
````
111
111
110
````
Answer: 8 (1X1) + 3 (2X2) = 11

### Run
To execute, run `node ./countGoodSquaresManager.js`

Results after processing a 1000x1000 matrix:

````
Execution time v1: 27ms
countGoodSquaresV1 found 564620 good squares
Execution time v2: 15ms
countGoodSquaresV2 found 564620 good squares
````

### TODO
Add tests with bigger matrices