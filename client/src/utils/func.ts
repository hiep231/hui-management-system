export const calculatePayAmount = (A, B, F, G, hasDrawnBefore) => {
  if (!hasDrawnBefore) {
    return A - B;
  }
  return A * F - (A - B) * G;
};

export const calculateReceiveAmount = (
  A: number,
  B: number,
  C: number,
  D: number,
  E: number,
  F: number,
  G: number
) => {
  return ((A - B) * C + A * D - E) * F - (A - B) * G;
};

export const getSafeId = (input: any): string => {
  if (!input) return "";
  if (typeof input === "string") return input;
  if (input.id) return input.id.toString();
  if (input._id) return input._id.toString();
  return "";
};
