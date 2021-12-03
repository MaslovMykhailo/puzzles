import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput
    .split("\n")
    .map((movement) => movement.split(" "))
    .map(([command, points]) => [command, Number(points)])

const applyCommand1 = {
  forward: ({ horizontal, depth }, points) => ({
    horizontal: horizontal + points,
    depth,
  }),
  down: ({ horizontal, depth }, points) => ({
    horizontal,
    depth: depth + points,
  }),
  up: ({ horizontal, depth }, points) => ({
    horizontal,
    depth: depth - points,
  }),
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const { horizontal, depth } = input.reduce(
    (position, [command, points]) => applyCommand1[command](position, points),
    { horizontal: 0, depth: 0 },
  )
  return horizontal * depth
}

const applyCommand2 = {
  forward: ({ horizontal, depth, aim }, points) => ({
    horizontal: horizontal + points,
    depth: depth + aim * points,
    aim,
  }),
  down: ({ horizontal, depth, aim }, points) => ({
    horizontal,
    depth,
    aim: aim + points,
  }),
  up: ({ horizontal, depth, aim }, points) => ({
    horizontal,
    depth,
    aim: aim - points,
  }),
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const { horizontal, depth } = input.reduce(
    (position, [command, points]) => applyCommand2[command](position, points),
    { horizontal: 0, depth: 0, aim: 0 },
  )
  return horizontal * depth
}

run({
  part1: {
    tests: [
      {
        input: `
          forward 5
          down 5
          forward 8
          up 3
          down 8
          forward 2
        `,
        expected: 150,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          forward 5
          down 5
          forward 8
          up 3
          down 8
          forward 2
        `,
        expected: 900,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
