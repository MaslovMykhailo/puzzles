import run from "aocrunner"

const parseInput = (rawInput) => {
  const [template, rules] = rawInput.split("\n\n")
  return {
    template,
    rules: rules.split("\n").reduce((map, rule) => {
      const [from, to] = rule.split(" -> ")
      map.set(from, to)
      return map
    }, new Map()),
  }
}

const Node = (value) => ({ value, next: null })

const LinkedList = (values) => {
  const head = Node(values.shift())
  values.reduce((node, value) => (node.next = Node(value)), head)

  const toValues = () => {
    let node = head
    const valuesArray = []
    do {
      valuesArray.push(node.value)
      node = node.next
    } while (node)
    return valuesArray
  }

  return {
    head,
    toValues,
  }
}

const nodeToPair = (node) => ({
  key: node.value + node.next.value,
  first: node,
  second: node.next,
})

const listToPairs = (list) => {
  const pairs = []

  let node = list.head
  while (node.next) {
    pairs.push(nodeToPair(node))
    node = node.next
  }

  return pairs
}

const calcListCounts = (list) =>
  list.toValues().reduce((map, value) => {
    if (value in map) {
      map[value]++
    } else {
      map[value] = 1
    }
    return map
  }, {})

const part1 = (rawInput) => {
  const { template, rules } = parseInput(rawInput)

  const linkedList = LinkedList(template.split(""))

  for (let step = 0; step < 10; step++) {
    const pairs = listToPairs(linkedList)
    for (const pair of pairs) {
      const next = Node(rules.get(pair.key))
      pair.first.next = next
      next.next = pair.second
    }
  }

  const counts = Object.values(calcListCounts(linkedList))
  return Math.max(...counts) - Math.min(...counts)
}

const updateCount = (map, key, d = 1) => {
  map.set(key, (map.get(key) || 0) + d)
}

const templateToCountedPairs = (template) =>
  template.split("").reduce(
    (countedPairs, element, index, elements) => {
      updateCount(countedPairs.elementCounts, element)
      if (index < elements.length - 1) {
        updateCount(countedPairs.pairCounts, element + elements[index + 1])
      }
      return countedPairs
    },
    { pairCounts: new Map(), elementCounts: new Map() },
  )

const nextPairs = (pair, element) => {
  const [first, last] = pair.split("")
  return [first + element, element + last]
}

const part2 = (rawInput) => {
  const { template, rules } = parseInput(rawInput)

  const { pairCounts, elementCounts } = templateToCountedPairs(template)
  for (let step = 0; step < 40; step++) {
    for (const [pair, count] of Array.from(pairCounts.entries())) {
      updateCount(pairCounts, pair, -count)

      const nextElement = rules.get(pair)
      updateCount(elementCounts, nextElement, count)

      nextPairs(pair, nextElement).forEach((nextPair) =>
        updateCount(pairCounts, nextPair, count),
      )
    }
  }

  const counts = Array.from(elementCounts.values())
  return Math.max(...counts) - Math.min(...counts)
}

const input = `
  NNCB

  CH -> B
  HH -> N
  CB -> H
  NH -> C
  HB -> C
  HC -> B
  HN -> C
  NN -> C
  BH -> H
  NC -> B
  NB -> B
  BN -> B
  BB -> N
  BC -> B
  CC -> N
  CN -> C
`

run({
  part1: {
    tests: [{ input, expected: 1588 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 2188189693529 }],
    solution: part2,
  },
  trimTestInputs: true,
})
