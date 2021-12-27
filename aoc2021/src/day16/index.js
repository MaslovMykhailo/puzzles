import run from "aocrunner"

const parseInput = (rawInput) => rawInput

// Number helpers

const hexToBin = (hex) => parseInt(hex, 16).toString(2).padStart(4, "0")

const hexesToBins = (hexes) => hexes.split("").map(hexToBin).join("")

const binsToDec = (bins) => parseInt(bins, 2)

// Solution helpers

const Bins = (input) => {
  const read = (number) => {
    const r = input.substring(0, number)
    input = input.substring(number)
    return r
  }

  const mapRead = (mapper) => (number) => mapper(read(number))

  const canRead = () => Boolean(input.length)

  return { read, mapRead, canRead }
}

const Packet = (version, type) => ({
  version,
  type,
  value: undefined,
  subPackets: [],
})

const parseValuePacket = (packet, bins) => {
  let literalValue = ""

  while (bins.read(1) === "1") {
    literalValue += bins.read(4)
  }

  literalValue += bins.read(4)
  packet.value = binsToDec(literalValue)

  return packet
}

const parseOperatorPacket = (packet, bins) => {
  const lengthTypeId = bins.read(1)

  if (lengthTypeId === "0") {
    const subPacketLength = bins.mapRead(binsToDec)(15)
    const subPacketBins = Bins(bins.read(subPacketLength))

    while (subPacketBins.canRead()) {
      const subPacket = parse(subPacketBins)
      packet.subPackets.push(subPacket)
    }
  } else {
    let subPacketsCount = bins.mapRead(binsToDec)(11)

    while (subPacketsCount--) {
      const subPacket = parse(bins)
      packet.subPackets.push(subPacket)
    }
  }

  return packet
}

const parse = (bins) => {
  const version = bins.mapRead(binsToDec)(3)
  const type = bins.mapRead(binsToDec)(3)

  const packet = Packet(version, type)

  if (type === 4) {
    return parseValuePacket(packet, bins)
  }

  return parseOperatorPacket(packet, bins)
}

// Solution 1

const totalVersions = (packet, total = 0) =>
  packet.subPackets.reduce(
    (sum, subPacket) => totalVersions(subPacket, sum),
    packet.version + total,
  )

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const root = parse(Bins(hexesToBins(input)))
  return totalVersions(root)
}

// Solution 2

const calculate = (packet) => {
  switch (packet.type) {
    case 0:
      return packet.subPackets.reduce(
        (sum, subPacket) => sum + calculate(subPacket),
        0,
      )
    case 1:
      return packet.subPackets.reduce(
        (product, subPacket) => product * calculate(subPacket),
        1,
      )
    case 2:
      return Math.min(...packet.subPackets.map(calculate))
    case 3:
      return Math.max(...packet.subPackets.map(calculate))
    case 4:
      return packet.value
    case 5: {
      const [v1, v2] = packet.subPackets.map(calculate)
      return Number(v1 > v2)
    }
    case 6: {
      const [v1, v2] = packet.subPackets.map(calculate)
      return Number(v1 < v2)
    }
    case 7: {
      const [v1, v2] = packet.subPackets.map(calculate)
      return Number(v1 === v2)
    }
  }
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const root = parse(Bins(hexesToBins(input)))
  return calculate(root)
}

const p1Input1 = "8A004A801A8002F478"
const p1Input2 = "620080001611562C8802118E34"
const p1Input3 = "C0015000016115A2E0802F182340"
const p1Input4 = "A0016C880162017C3686B18A3D4780"

const p2Input1 = "C200B40A82"
const p2Input2 = "04005AC33890"
const p2Input3 = "880086C3E88112"
const p2Input4 = "CE00C43D881120"
const p2Input5 = "D8005AC2A8F0"
const p2Input6 = "F600BC2D8F"
const p2Input7 = "9C005AC2F8F0"
const p2Input8 = "9C0141080250320F1802104A08"

run({
  part1: {
    tests: [
      { input: p1Input1, expected: 16 },
      { input: p1Input2, expected: 12 },
      { input: p1Input3, expected: 23 },
      { input: p1Input4, expected: 31 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: p2Input1, expected: 3 },
      { input: p2Input2, expected: 54 },
      { input: p2Input3, expected: 7 },
      { input: p2Input4, expected: 9 },
      { input: p2Input5, expected: 1 },
      { input: p2Input6, expected: 0 },
      { input: p2Input7, expected: 0 },
      { input: p2Input8, expected: 1 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
