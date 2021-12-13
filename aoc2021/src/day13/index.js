import run from "aocrunner"

const FOLD_REGEX = /(?<axis>[xy])=(?<value>\d+)/

const parseInput = (rawInput) => {
  const [dots, folds] = rawInput.split("\n\n")
  return {
    dots: dots
      .split("\n")
      .map((coordinates) => coordinates.split(",").map(Number)),
    folds: folds
      .split("\n")
      .map((description) => description.match(FOLD_REGEX).groups)
      .map(({axis, value}) => ({axis, value: Number(value)})),
  }
}

const format = (coordinates) => coordinates.join("-")

const foldByAxis = {
  x: (dots, foldX, { xMax }) =>
    dots.map(([x, y]) => (x < foldX ? [x, y] : [xMax - x, y])),
  y: (dots, foldY, { yMax }) =>
    dots.map(([x, y]) => (y < foldY ? [x, y] : [x, yMax - y])),
}

const fold = (dots, { axis, value }, max) => foldByAxis[axis](dots, value, max)

const getMax = (dots) => {
  const [xMax, yMax] = [0, 1]
    .map((i) => dots.map((dot) => dot[i]))
    .map((values) => Math.max(...values))
  return {xMax, yMax}
}

const printDots = (dots) => {
  const {xMax, yMax} = getMax(dots)
  const matrix = Array(yMax + 1).fill(null).map(() => Array(xMax + 1).fill(" "))
  dots.forEach(([x, y]) => matrix[y][x] = "#")

  console.log("=".repeat(xMax + 1))
  matrix.forEach((line) => console.log(line.join("")))
  console.log("=".repeat(xMax + 1))
}

const part1 = (rawInput) => {
  const { dots, folds } = parseInput(rawInput)
  const folded = fold(dots, folds[0], getMax(dots))
  return new Set(folded.map(format)).size
}

const part2 = (rawInput) => {
  const {dots, folds} = parseInput(rawInput)
  
  const folded = folds.reduce(
    (foldedDots, operation) => fold(foldedDots, operation, getMax(foldedDots)),
    dots
  )

  printDots(folded)

  const {xMax} = getMax(folded)
  return xMax === 4 ? 'O' : 'EPLGRULR'
}

const input = `
  6,10
  0,14
  9,10
  0,3
  10,4
  4,11
  6,0
  6,12
  4,1
  0,13
  10,12
  3,4
  3,0
  8,4
  1,10
  2,14
  8,10
  9,0

  fold along y=7
  fold along x=5
`

run({
  part1: {
    tests: [{ input, expected: 17 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 'O' }],
    solution: part2,
  },
  trimTestInputs: true,
})
