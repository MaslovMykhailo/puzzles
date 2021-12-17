import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput.split("\n").map((line) => line.split("").map(Number))

const format = (x, y) => `${x}-${y}`

const parse = (point) => point.split("-").map(Number)

const forEachNeighbor = (point, matrix, f) => {
  const [px, py] = parse(point)
  ;[-1, 1]
    .flatMap((d) => [
      [px + d, py],
      [px, py + d],
    ])
    .filter(
      ([x, y]) => y > -1 && x > -1 && y < matrix.length && x < matrix[y].length,
    )
    .forEach(([x, y]) => f(format(x, y)))
}

const findLowestRiskPath = (matrix) => {
  const notVisited = new Set()
  const risks = new Map()

  matrix.forEach((line, y) =>
    line.forEach((_, x) => {
      const point = format(x, y)
      notVisited.add(point)
      risks.set(point, Infinity)
    }),
  )

  const firstPoint = format(0, 0)
  const lastPoint = format(
    matrix[matrix.length - 1].length - 1,
    matrix.length - 1,
  )

  risks.set(firstPoint, 0)

  while (notVisited.has(lastPoint)) {
    const [minPoint] = Array.from(notVisited.values()).sort(
      (p1, p2) => risks.get(p1) - risks.get(p2),
    )

    notVisited.delete(minPoint)

    forEachNeighbor(minPoint, matrix, (neighborPoint) => {
      if (!notVisited.has(neighborPoint)) {
        return
      }

      const [nx, ny] = parse(neighborPoint)
      const risk = risks.get(minPoint) + matrix[ny][nx]

      if (risk < risks.get(neighborPoint)) {
        risks.set(neighborPoint, risk)
      }
    })
  }

  return risks.get(lastPoint)
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  return findLowestRiskPath(input)
}

const growMap = (map) => {
  const maxY = map.length
  const maxX = map[maxY - 1].length

  const [grownX, grownY] = [maxX, maxY].map((n) => n * 5)

  const grown = Array(grownY)
    .fill(null)
    .map(() => Array(grownX).fill(0))

  for (let y = 0; y < grownY; y++) {
    for (let x = 0; x < grownX; x++) {
      const [dx, dy] = [x / maxX, y / maxY].map(Math.floor)
      const n = map[y % maxY][x % maxX] + dx + dy
      grown[y][x] = n > 9 ? n - 9 : n
    }
  }

  return grown
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  return findLowestRiskPath(growMap(input))
}

const input = `
  1163751742
  1381373672
  2136511328
  3694931569
  7463417111
  1319128137
  1359912421
  3125421639
  1293138521
  2311944581
`

run({
  part1: {
    tests: [{ input, expected: 40 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 315 }],
    solution: part2,
  },
  trimTestInputs: true,
})
