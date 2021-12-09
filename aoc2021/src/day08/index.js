import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput
    .split("\n")
    .map((line) =>
      line.split(" | ").map((message) => message.split(" ").filter(Boolean)),
    )

const sort = (str) => str.split("").sort().join("")

const toSet = (str) => new Set(str.split("").sort())

const toString = (s) => Array.from(s).join("")

const diff = (str1, str2) => {
  const [s1, s2] = [str1, str2].map(toSet)
  const d = new Set()
  s1.forEach((s) => {
    if (!s2.has(s)) {
      d.add(s)
    }
  })
  return sort(toString(d))
}

const conc = (s1, s2) =>
  sort(toString(new Set([s1, s2].flatMap((s) => s.split("")))))

const intr = (str1, str2) => {
  const [s1, s2] = [str1, str2].map(toSet)
  const d = new Set()
  s1.forEach((s) => {
    if (s2.has(s)) {
      d.add(s)
    }
  })
  return sort(toString(d))
}

const lengthDigitMap = {
  [2]: [1],
  [3]: [7],
  [4]: [4],
  [5]: [2, 3, 5],
  [6]: [0, 6, 9],
  [7]: [8],
}

const digitSymbolsMap = {
  [0]: "abcefg",
  [1]: "cf",
  [2]: "acdeg",
  [3]: "adcfg",
  [4]: "bcdf",
  [5]: "abdfg",
  [6]: "abdefg",
  [7]: "acf",
  [8]: "abcdefg",
  [9]: "abcdfg",
}

const symbolsDigitMap = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  adcfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)

  const outputs = input.flatMap(([, output]) => output)
  const amount = outputs.reduce(
    (count, output) =>
      count + Number(lengthDigitMap[output.length].length === 1),
    0,
  )

  return amount
}

const operations = [diff, conc, intr]

const decodeKeys = (solution, known, [k1, k2]) =>
  operations.forEach((op) => {
    const r = op(k1, k2)
    if (r.length && !solution.has(r)) {
      const s = op(solution.get(k1), solution.get(k2))
      solution.set(r, s)
      if (s in symbolsDigitMap) {
        known.set(symbolsDigitMap[s], r)
      }
    }
  })

const decode = (solution, known) => {
  const encoded = Array.from(solution.keys())
  for (const e1 of encoded) {
    for (const e2 of encoded) {
      decodeKeys(solution, known, [e1, e2])
    }
  }
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  const outputs = input.map(([, output]) => output).map((o) => o.map(sort))

  const messages = input
    .map(([message, output]) => message.concat(output))
    .map((m) => m.map(sort))

  let sum = 0

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const output = outputs[i]

    const decoded = new Map()
    const knownDigits = new Map()

    const setDecoded = (symbols, digit) => {
      decoded.set(symbols, digitSymbolsMap[digit])
      knownDigits.set(digit, symbols)
    }

    // guess 8
    setDecoded("abcdefg", 8)

    message.forEach((s) => {
      const possibleDigits = lengthDigitMap[s.length]
      // guess 1, 4, 7
      if (possibleDigits.length === 1) {
        setDecoded(s, possibleDigits[0])
      }
    })
    decode(decoded, knownDigits)

    do {
      if (knownDigits.has(1) || knownDigits.has(7)) {
        const knownDigit = knownDigits.get(1) || knownDigits.get(7)
        message.forEach((s) => {
          // guess 3
          if (s.length === 5) {
            if (diff(knownDigit, s).length === 0) {
              setDecoded(s, 3)
            }
          }
          // guess 6
          if (s.length === 6) {
            if (diff(knownDigit, s).length === 1) {
              setDecoded(s, 6)
            }
          }
        })
        decode(decoded, knownDigits)
      }

      if (knownDigits.has(4)) {
        const knownDigit = knownDigits.get(4)
        message.forEach((s) => {
          // guess 2
          if (s.length === 5) {
            if (diff(knownDigit, s).length === 2) {
              setDecoded(s, 2)
            }
          }
          // guess 9
          if (s.length === 9) {
            if (diff(knownDigit, s).length === 0) {
              setDecoded(s, 9)
            }
          }
        })
        decode(decoded, knownDigits)
      }
    } while (output.some((o) => !decoded.has(o)))

    sum += Number(output.map((o) => symbolsDigitMap[decoded.get(o)]).join(""))
  }

  return sum
}

const input = `
  be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
  edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
  fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
  fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
  aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
  fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
  dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
  bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
  egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
  gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`

run({
  part1: {
    tests: [{ input, expected: 26 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 61229 }],
    solution: part2,
  },
  trimTestInputs: true,
})
