import run from "aocrunner"

const INPUT_REGEX =
  /x\=(?<x1>[-\d]+)\.\.(?<x2>[-\d]+), y\=(?<y1>[-\d]+)\.\.(?<y2>[-\d]+)/

const parseInput = (rawInput) => {
  const match = rawInput.match(INPUT_REGEX)
  return [
    { x: Number(match.groups.x1), y: Number(match.groups.y1) },
    { x: Number(match.groups.x2), y: Number(match.groups.y2) },
  ]
}

const move = ({ point, velocity }) => ({
  point: {
    x: point.x + velocity.x,
    y: point.y + velocity.y,
  },
  velocity: {
    x: velocity.x === 0 ? 0 : velocity.x + (velocity.x > 0 ? -1 : 1),
    y: velocity.y - 1,
  },
})

const sumOfN = (n) =>
  Array(n)
    .fill(0)
    .reduce((s, _, i) => s + n - i - 1, 0)

const yn =
  (v0, y0 = 0) =>
  (n) =>
    y0 + n * v0 - sumOfN(n)

const xn =
  (v0, x0 = 0) =>
  (n) =>
    x0 + n * v0 - sumOfN(n < v0 ? n : 2 * n - v0 - 1)

const getVy0 = (n) => (y) => (y + sumOfN(n)) / n

const getAllTargetPoints = ([p1, p2]) => {
  const points = []
  for (let x = p1.x; x <= p2.x; x++) {
    for (let y = p1.y; y <= p2.y; y++) {
      points.push({ x, y })
    }
  }
  return points
}

const getPossibleStepsCount = ([p1, p2]) =>
  Math.max(...[...Object.values(p1), ...Object.values(p2)].map(Math.abs)) * 2

const getMaxXVelocity = ([p1, p2]) => Math.max(p1.x, p2.x)

const isTargetX =
  ([p1, p2]) =>
  (x) =>
    x >= p1.x && x <= p2.x

const format = ({ x, y }) => `${x},${y}`

const part1 = (rawInput) => {
  const input = parseInput(rawInput)

  const targetPoints = getAllTargetPoints(input)
  let stepsCount = getPossibleStepsCount(input)

  const possibleVelocities = []

  do {
    const step = stepsCount
    const getVy = getVy0(step)

    targetPoints.forEach((point) => {
      const y = getVy(point.y)
      if (y >= 0 && Number.isInteger(y)) {
        possibleVelocities.push({ y, step })
      }
    })
  } while (--stepsCount)

  const maxY = possibleVelocities.reduce((max, { y, step }) => {
    const getY = yn(y)
    for (let n = 1; n <= step; n++) {
      const y = getY(n)
      if (y > max) {
        max = y
      }
    }
    return max
  }, 0)

  return maxY
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  const targetPoints = getAllTargetPoints(input)
  const maxXVelocity = getMaxXVelocity(input)
  const isTarget = isTargetX(input)
  let stepsCount = getPossibleStepsCount(input)

  const possibleVelocities = new Set()

  do {
    const step = stepsCount

    const sn = sumOfN(step)
    const getVy = getVy0(step)

    targetPoints
      .filter(({ y }) => (y + sn) % step === 0)
      .forEach((point) => {
        const y = getVy(point.y)
        let x = maxXVelocity
        do {
          if (isTarget(xn(x)(step))) {
            possibleVelocities.add(format({ x, y }))
          }
        } while (--x)
      })
  } while (--stepsCount)

  return possibleVelocities.size
}

const input = "target area: x=20..30, y=-10..-5"

run({
  part1: {
    tests: [{ input, expected: 45 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 112 }],
    solution: part2,
  },
  trimTestInputs: true,
})
