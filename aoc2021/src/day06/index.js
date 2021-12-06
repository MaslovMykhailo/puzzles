import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split(",").map(Number)

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  for (let day = 0; day < 80; day++) {
    const size = input.length
    for (let i = 0; i < size; i++) {
      if (input[i] === 0) {
        input[i] = 6
        input.push(8)
      } else {
        input[i]--
      }
    }
  }
  return input.length
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  const population = Array(9).fill(0)
  input.forEach((i) => population[i]++)

  for (let day = 0; day < 256; day++) {
    population[7] += population[0]
    population.push(population.shift())
  }

  return population.reduce((s, n) => s + n)
}

const input = "3,4,3,1,2"

run({
  part1: {
    tests: [{ input, expected: 5934 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 26984457539 }],
    solution: part2,
  },
  trimTestInputs: true,
})
