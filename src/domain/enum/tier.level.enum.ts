export enum TierLevel {
    S = "S",
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    F = "F",
    NA = "NA",
}

export const TierColors: Record<TierLevel, string> = {
  [TierLevel.S]: "red-tier",
  [TierLevel.A]: "orange-tier",
  [TierLevel.B]: "yellow-tier",
  [TierLevel.C]: "green-tier",
  [TierLevel.D]: "blue-tier",
  [TierLevel.E]: "blue2-tier",
  [TierLevel.F]: "purple-tier",
  [TierLevel.NA]: "gray-tier",
};
