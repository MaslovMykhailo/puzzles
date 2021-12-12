import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput.split("\n").map((energies) => energies.split("").map(Number))

const foreach = (array, f) => {
  for (let y = 0; y < array.length; y++) {
    for (let x = 0; x < array[y].length; x++) {
      f(array[y][x], [x, y])
    }
  }
}

const foreachNeighbor = (array, [x, y], f) => {
  ;[-1, 1]
    .flatMap((d) => [
      [x + d, y],
      [x, y + d],
      [x + d, y + d],
      [x + d, y - d],
    ])
    .filter(
      ([x, y]) => y > -1 && x > -1 && y < array.length && x < array[y].length,
    )
    .forEach(([x, y]) => f(array[y][x], [x, y]))
}

const format = ([x, y]) => `${x}-${y}`

const increaseEnergy = (energies) => {
  foreach(energies, (_, [i, line]) => energies[line][i]++)
}

const flash = (energies, toFlash, flashed) => {
  toFlash.forEach(([i, line]) => {
    energies[line][i] = 0
    flashed.add(format([i, line]))

    foreachNeighbor(energies, [i, line], (_, [nI, nLine]) => {
      if (flashed.has(format([nI, nLine]))) return
      energies[nLine][nI]++
    })
  })
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)

  let flashedCount = 0

  for (let step = 0; step < 100; step++) {
    increaseEnergy(input)
    const flashed = new Set()

    let toFlash
    do {
      toFlash = []
      foreach(input, (n, p) => {
        if (n > 9) toFlash.push(p)
      })
      flash(input, toFlash, flashed)
    } while (toFlash.length)

    flashedCount += flashed.size
  }

  return flashedCount
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const count = input.length * input[0].length

  let step = 0
  do {
    step++

    increaseEnergy(input)
    const flashed = new Set()

    let toFlash
    do {
      toFlash = []
      foreach(input, (n, p) => {
        if (n > 9) toFlash.push(p)
      })
      flash(input, toFlash, flashed)
    } while (toFlash.length)

    if (flashed.size === count) {
      return step
    }
  } while (true)
}

const input = `
  5483143223
  2745854711
  5264556173
  6141336146
  6357385478
  4167524645
  2176841721
  6882881134
  4846848554
  5283751526
`

run({
  part1: {
    tests: [{ input, expected: 1656 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 195 }],
    solution: part2,
  },
  trimTestInputs: true,
})
