import type { SpiralPosition } from "@/types/grid";

export function buildSpiralPositions(count: number): SpiralPosition[] {
  const positions: SpiralPosition[] = [{ col: 0, row: 0 }];
  if (count <= 1) return positions;

  for (let ring = 1; positions.length < count; ring += 1) {
    const ringPositions: SpiralPosition[] = [
      { col: 0, row: -ring },
      { col: ring, row: -ring },
      { col: ring, row: 0 },
      { col: ring, row: ring },
      { col: 0, row: ring },
      { col: -ring, row: ring },
      { col: -ring, row: 0 },
      { col: -ring, row: -ring },
    ];

    for (let col = 1; col <= ring; col += 1) ringPositions.push({ col, row: -ring });
    for (let row = 1; row <= ring; row += 1) ringPositions.push({ col: ring, row });
    for (let col = ring - 1; col >= -ring; col -= 1) ringPositions.push({ col, row: ring });
    for (let row = ring - 1; row >= -ring; row -= 1) ringPositions.push({ col: -ring, row });
    for (let col = -ring + 1; col < 0; col += 1) ringPositions.push({ col, row: -ring });

    const seen = new Set<string>();
    for (const position of ringPositions) {
      const key = `${position.col}:${position.row}`;
      if (seen.has(key)) continue;
      seen.add(key);
      positions.push(position);
      if (positions.length === count) return positions;
    }
  }

  return positions;
}
