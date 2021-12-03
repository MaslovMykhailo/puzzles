import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split("\n").map(Number)

const part1 = (rawInput) =>
  parseInput(rawInput).reduce(
    (count, n, i, nums) => count + (i ? n > nums[i - 1] : 0),
    0,
  )

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  let i = 0,
    count = 0,
    prev = 0

  for (i; i < input.length; ++i) {
    const sum = input[i] + (input[i + 1] || 0) + (input[i + 2] || 0)
    sum > prev && ++count
    prev = sum
  }

  return count - 1
}

run({
  part1: {
    tests: [
      {
        input: "199\n200\n208\n210\n200\n207\n240\n269\n260\n263",
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: "607\n618\n618\n617\n647\n716\n769\n792",
        expected: 5,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
