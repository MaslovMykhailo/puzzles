import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput.split("\n").map((line) => line.split(""))

const openToClose = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
}

const points1 = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
}

const isOpen = (s) => s in openToClose

const part1 = (rawInput) => {
  const input = parseInput(rawInput)

  const corrupted = []

  for (const line of input) {
    const stack = []
    for (const s of line) {
      if (isOpen(s)) {
        stack.push(openToClose[s])
      } else if (s !== stack.pop()) {
        corrupted.push(s)
        break
      }
    }
  }

  return corrupted.reduce((s, b) => s + points1[b], 0)
}

const points2 = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  const incomplete = []

  for (const line of input) {
    let corrupted = false
    const stack = []
    for (const s of line) {
      if (isOpen(s)) {
        stack.push(openToClose[s])
      } else {
        const last = stack[stack.length - 1]
        if (s !== last) {
          corrupted = true
          break
        } else {
          stack.pop()
        }
      }
    }

    if (!corrupted && stack.length) {
      incomplete.push(stack.reverse())
    }
  }

  const values = incomplete
    .map((line) => line.reduce((p, s) => p * 5 + points2[s], 0))
    .sort((n1, n2) => n1 - n2)

  return values[Math.floor(values.length / 2)]
}

const input = `
  [({(<(())[]>[[{[]{<()<>>
  [(()[<>])]({[<{<<[]>>(
  {([(<{}[<>[]}>{[]{[(<()>
  (((({<>}<{<{<>}{[]{[]{}
  [[<[([]))<([[{}[[()]]]
  [{[{({}]{}}([{[{{{}}([]
  {<[[]]>}<{[{[{[]{()[[[]
  [<(<(<(<{}))><([]([]()
  <{([([[(<>()){}]>(<<{{
  <{([{{}}[<[[[<>{}]]]>[]]
`

run({
  part1: {
    tests: [{ input, expected: 26397 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 288957 }],
    solution: part2,
  },
  trimTestInputs: true,
})
