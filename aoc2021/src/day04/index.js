import run from "aocrunner"

const parseInput = (rawInput) => {
  const splitted = rawInput.split("\n\n")

  const numbers = splitted.shift().split(",").map(Number)

  const boards = splitted.map((board) =>
    board
      .split("\n")
      .map((line) => line.split(/\s+/).filter(Boolean).map(Number))
      .map((line) => new Set(line)),
  )

  return { numbers, boards }
}

const transpose = (board) =>
  Array.from(board[0])
    .map((_, i) => board.map((line) => Array.from(line)).map((line) => line[i]))
    .map((line) => new Set(line))

const hasBingo = (board, n) => {
  let bingo = false
  board.forEach((line) => {
    if (line.delete(n) && line.size === 0) {
      bingo = true
    }
  })
  return bingo
}

const findBingo = (numbers, boards) => {
  const transposed = boards.map(transpose)
  for (const n of numbers) {
    for (let i = 0; i < boards.length; i++) {
      if (hasBingo(boards[i], n) || hasBingo(transposed[i], n)) {
        return { n, board: boards[i] }
      }
    }
  }
}

const findLastBingo = (numbers, boards) => {
  const transposed = boards.map(transpose)
  const noBingoBoards = new Set(
    Array(boards.length)
      .fill(0)
      .map((_, i) => i),
  )
  for (const n of numbers) {
    for (const i of Array.from(noBingoBoards).sort((n1, n2) => n1 - n2)) {
      if (hasBingo(boards[i], n) || hasBingo(transposed[i], n)) {
        if (noBingoBoards.delete(i) && noBingoBoards.size === 0) {
          return { n, board: boards[i] }
        }
      }
    }
  }
}

const part1 = (rawInput) => {
  const { numbers, boards } = parseInput(rawInput)

  const { n, board } = findBingo(numbers, boards)
  const sum = board
    .flatMap((line) => Array.from(line))
    .reduce((s, p) => s + p, 0)

  return sum * n
}

const part2 = (rawInput) => {
  const { numbers, boards } = parseInput(rawInput)

  const { n, board } = findLastBingo(numbers, boards)
  const sum = board
    .flatMap((line) => Array.from(line))
    .reduce((s, p) => s + p, 0)

  return sum * n
}

run({
  part1: {
    tests: [
      {
        input: `
          7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

          22 13 17 11  0
          8  2 23  4 24
          21  9 14 16  7
          6 10  3 18  5
          1 12 20 15 19

          3 15  0  2 22
          9 18 13 17  5
          19  8  7 25 23
          20 11 10 24  4
          14 21 16 12  6

          14 21 17 24  4
          10 16 15  9 19
          18  8 23 26 20
          22 11 13  6  5
          2  0 12  3  7
        `,
        expected: 4512,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

          22 13 17 11  0
          8  2 23  4 24
          21  9 14 16  7
          6 10  3 18  5
          1 12 20 15 19

          3 15  0  2 22
          9 18 13 17  5
          19  8  7 25 23
          20 11 10 24  4
          14 21 16 12  6

          14 21 17 24  4
          10 16 15  9 19
          18  8 23 26 20
          22 11 13  6  5
          2  0 12  3  7
        `,
        expected: 1924,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
