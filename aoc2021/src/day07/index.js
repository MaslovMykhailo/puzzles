import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split(",").map(Number)

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const size = input.length

  const [min, max] = [Math.min, Math.max].map((f) => f(...input))
  let minSpent = Infinity

  for (let p = min; p <= max; p++) {
    let spent = 0
    for (let i = 0; i < size / 2; i++) {
      spent += Math.abs(input[i] - p) + Math.abs(input[size - i - 1] - p)
    }
    minSpent = Math.min(minSpent, spent)
  }

  return minSpent
}

const sum = (n1, n2) => n1 + n2
const calcSpent = (n) => (n * (n + 1)) / 2

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const size = input.length

  const [min, max] = [Math.min, Math.max].map((f) => f(...input))
  let minSpent = Infinity

  for (let p = min; p <= max; p++) {
    let spent = 0
    for (let i = 0; i < size / 2; i++) {
      spent +=
        calcSpent(Math.abs(input[i] - p)) +
        calcSpent(Math.abs(input[size - i - 1] - p))
    }
    minSpent = Math.min(minSpent, spent)
  }

  return minSpent
}

const input = "16,1,2,0,4,2,7,1,2,14"

run({
  part1: {
    tests: [{ input, expected: 37 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 168 }],
    solution: part2,
  },
  trimTestInputs: true,
})
