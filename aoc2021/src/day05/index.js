import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput
    .split("\n")
    .map((line) => line.split(" -> ").map((xy) => xy.split(",").map(Number)))

const sort = (array) => array.sort((n1, n2) => n1 - n2)

const lookupX = (map, xs, y) => {
  const [start, end] = sort(xs)
  for (let x = start; x <= end; x++) {
    map[y][x]++
  }
  return map
}

const lookupY = (map, x, ys) => {
  const [start, end] = sort(ys)
  for (let y = start; y <= end; y++) {
    map[y][x]++
  }
  return map
}

const lookupXY = (map, [x1, y1], [x2, y2]) => {
  const [dx, dy] = [x1 < x2, y1 < y2].map((b) => (b ? 1 : -1))
  for (let x = x1, y = y1; x - x2 != dx && y - y2 != dy; x += dx, y += dy) {
    map[y][x]++
  }
  return map
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput).filter(
    ([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2,
  )

  const size = Math.max(...input.flat(2)) + 1

  const diagram = input.reduce(
    (map, [[x1, y1], [x2, y2]]) => {
      if (x1 === x2) {
        return lookupY(map, x1, [y1, y2])
      }
      if (y1 === y2) {
        return lookupX(map, [x1, x2], y2)
      }
    },
    Array(size)
      .fill(null)
      .map(() => Array(size).fill(0)),
  )

  const overlaps = diagram.reduce(
    (count, line) => count + line.filter((c) => c > 1).length,
    0,
  )

  return overlaps
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  const size = Math.max(...input.flat(2)) + 1

  const diagram = input.reduce(
    (map, [[x1, y1], [x2, y2]]) => {
      if (x1 === x2) {
        return lookupY(map, x1, [y1, y2])
      }
      if (y1 === y2) {
        return lookupX(map, [x1, x2], y2)
      }
      return lookupXY(map, [x1, y1], [x2, y2])
    },
    Array(size)
      .fill(null)
      .map(() => Array(size).fill(0)),
  )

  const overlaps = diagram.reduce(
    (count, line) => count + line.filter((c) => c > 1).length,
    0,
  )

  return overlaps
}

const input = `
  0,9 -> 5,9
  8,0 -> 0,8
  9,4 -> 3,4
  2,2 -> 2,1
  7,0 -> 7,4
  6,4 -> 2,0
  0,9 -> 2,9
  3,4 -> 1,4
  0,0 -> 8,8
  5,5 -> 8,2
`

run({
  part1: {
    tests: [{ input, expected: 5 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 12 }],
    solution: part2,
  },
  trimTestInputs: true,
})
