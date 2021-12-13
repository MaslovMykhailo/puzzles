import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput.split("\n").map((line) => line.split("-"))

const Vertex = (key) => {
  const edges = new Set()
  return {
    key,
    edges,
    addEdge: (v) => edges.add(v),
    isSmall: key.length < 3 && key.charCodeAt(0) > 95,
    isStart: key === "start",
    isEnd: key === "end",
  }
}

const Graph = (relations) => {
  const vertices = relations
    .flat()
    .reduce((map, key) => map.set(key, Vertex(key)), new Map())

  relations.forEach(([k1, k2]) => {
    const v1 = vertices.get(k1)
    v1.addEdge(vertices.get(k2))

    const v2 = vertices.get(k2)
    v2.addEdge(vertices.get(k1))
  })

  return {
    getStart: () => vertices.get("start"),
  }
}

const findPaths1 = (vertex, path, found) => {
  if (vertex.isStart) {
    return
  }

  if (vertex.isSmall && path.includes(vertex)) {
    return
  }

  path.push(vertex)

  if (vertex.isEnd) {
    found.push(path)
    return
  }

  vertex.edges.forEach((next) => findPaths1(next, path.slice(), found))
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)

  const graph = Graph(input)
  const start = graph.getStart()

  const paths = []

  for (const v of start.edges) {
    paths.concat(findPaths1(v, [start], paths))
  }

  return paths.length
}

const findPaths2 = (vertex, path, found, smallTwice = false) => {
  if (vertex.isStart) {
    return
  }

  if (smallTwice && vertex.isSmall && path.includes(vertex)) {
    return
  }

  path.push(vertex)

  if (vertex.isEnd) {
    found.push(path)
    return
  }

  smallTwice =
    smallTwice ||
    (vertex.isSmall && path.indexOf(vertex) !== path.lastIndexOf(vertex))

  vertex.edges.forEach((next) =>
    findPaths2(next, path.slice(), found, smallTwice),
  )
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  const graph = Graph(input)
  const start = graph.getStart()

  const paths = []

  for (const v of start.edges) {
    paths.concat(findPaths2(v, [start], paths))
  }

  return paths.length
}

const input = `
  start-A
  start-b
  A-c
  A-b
  b-d
  A-end
  b-end
`

run({
  part1: {
    tests: [{ input, expected: 10 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 36 }],
    solution: part2,
  },
  trimTestInputs: true,
})
