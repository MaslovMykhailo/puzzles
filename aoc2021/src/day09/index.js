import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput.split("\n").map((line) => line.split("").map(Number))

const isPointInvalid = (p, size) => p < 0 || p > size - 1

const isCoordinatePreset = ([x, y], a) =>
  !isPointInvalid(y, a.length) && !isPointInvalid(x, a[y].length)

const forEachPoint = (array, f) => {
  for (let y = 0; y < array.length; y++) {
    for (let x = 0; x < array[y].length; x++) {
      f(array[y][x], [x, y])
    }
  }
}

const getNeighbors = (array, [x, y]) =>
  [-1, 1]
    .flatMap((d) => [
      [x + d, y],
      [x, y + d],
    ])
    .filter((p) => isCoordinatePreset(p, array))

const toMarkedLowest = (n) => ({ n, lowest: false })

const markLowest = (array) => {
  forEachPoint(array, (current, p) => {
    const points = getNeighbors(array, p)
    current.lowest = points.every(([px, py]) => current.n < array[py][px].n)
  })
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput).map((line) => line.map(toMarkedLowest))

  markLowest(input)

  return input
    .flat()
    .filter(({ lowest }) => lowest)
    .reduce((sum, { n }) => sum + n + 1, 0)
}

const toString = ([x, y]) => `${y}-${x}`

const findBasin = (array, point, visited = new Set()) => {
  const pString = toString(point)
  if (visited.has(pString)) {
    return visited
  }

  visited.add(pString)
  return getNeighbors(array, point)
    .filter(([x, y]) => array[y][x] !== 9)
    .reduce((v, p) => findBasin(array, p, v), visited)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  const basins = []
  forEachPoint(input, (current, p) => {
    if (current === 9) return

    if (getNeighbors(input, p).every(([x, y]) => input[y][x] > current)) {
      basins.push(findBasin(input, p).size)
    }
  })

  return basins
    .sort((n1, n2) => n2 - n1)
    .slice(0, 3)
    .reduce((m, n) => m * n, 1)
}

const input = `
  2199943210
  3987894921
  9856789892
  8767896789
  9899965678
`

run({
  part1: {
    tests: [{ input, expected: 15 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 1134 }],
    solution: part2,
  },
  trimTestInputs: true,
})
