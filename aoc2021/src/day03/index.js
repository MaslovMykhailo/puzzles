import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput.split("\n").map((binary) => binary.split("").map(Number))

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const inputSum = input.reduce((sum, binaries) => {
    binaries.forEach((bin, index) => (sum[index] += bin))
    return sum
  }, Array(input[0].length).fill(0))

  const gammaRate = []
  const epsilonRate = []

  const threshold = Math.round(input.length / 2)

  inputSum.forEach((sum) => {
    if (sum > threshold) {
      gammaRate.push(1)
      epsilonRate.push(0)
    } else {
      gammaRate.push(0)
      epsilonRate.push(1)
    }
  })

  const [gamma, epsilon] = [gammaRate, epsilonRate]
    .map((rate) => rate.join(""))
    .map((rate) => parseInt(rate, 2))

  return gamma * epsilon
}

const getCommonBits = (input, index) => {
  const inputSum = input.reduce((sum, binaries) => sum + binaries[index], 0)
  const threshold = Math.round(input.length / 2)
  return inputSum >= threshold ? { most: 1, least: 0 } : { most: 0, least: 1 }
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  let O2rate = input.slice()
  let CO2rate = input.slice()

  for (let i = 0; i < input[0].length; i++) {
    if (O2rate.length > 1) {
      const { most } = getCommonBits(O2rate, i)
      O2rate = O2rate.filter((binaries) => binaries[i] === most)
    }

    if (CO2rate.length > 1) {
      const { least } = getCommonBits(CO2rate, i)
      CO2rate = CO2rate.filter((binaries) => binaries[i] === least)
    }
  }

  const [O2, CO2] = [O2rate, CO2rate]
    .map((rate) => rate.pop())
    .map((rate) => rate.join(""))
    .map((rate) => parseInt(rate, 2))

  return O2 * CO2
}

run({
  part1: {
    tests: [
      {
        input: `
          00100
          11110
          10110
          10111
          10101
          01111
          00111
          11100
          10000
          11001
          00010
          01010
        `,
        expected: 198,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          00100
          11110
          10110
          10111
          10101
          01111
          00111
          11100
          10000
          11001
          00010
          01010
        `,
        expected: 230,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
