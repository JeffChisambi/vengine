export function getFlaskColor(neutralization, indicator, flash = 0) {
  if (indicator === "phenolphthalein") {
    if (neutralization >= 1.0) {
      const excess = Math.min((neutralization - 1.0) * 8, 1);
      return `rgba(255,${Math.round(130 - excess * 30)},${Math.round(170 - excess * 30)},0.7)`;
    }
    const baseA = 0.08 + neutralization * 0.12;
    const flashA = flash * 0.55;
    const g = Math.round(255 - flash * 100);
    const b = Math.round(255 - flash * 80);
    return `rgba(255,${g},${b},${Math.min(baseA + flashA, 0.65)})`;
  } else {
    if (neutralization >= 1.0) return `rgba(255,220,80,0.55)`;
    const g = Math.round(140 + neutralization * 70);
    return `rgba(255,${g},0,0.55)`;
  }
}

export function getPH(v, vEnd = 23.5) {
  if (v <= 0) return 1.0;
  const f = v / vEnd;
  if (f < 0.9) return 1.0 + f * 5.5;
  if (f < 1.0) return 6.5 + ((f - 0.9) / 0.1) * 1.5;
  return 8.0 + Math.min((f - 1.0) * 6, 4);
}
