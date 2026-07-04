export interface NewsStyle {
  /** Thai/English risk label. */
  label: string;
  /** Solid badge classes. */
  badge: string;
  /** Text colour class. */
  text: string;
  /** Dot colour class. */
  dot: string;
  hex: string;
}

/**
 * National Early Warning Score risk banding.
 *   >= 5  -> High risk (red)
 *   3-4   -> Medium / abnormal (orange)
 *   0-2   -> Low / normal (green)
 */
export function newsStyle(score: number): NewsStyle {
  if (score >= 5) {
    return {
      label: "High Risk",
      badge: "bg-red-500 text-white",
      text: "text-red-600",
      dot: "bg-red-500",
      hex: "#ef4444",
    };
  }
  if (score >= 3) {
    return {
      label: "Medium Risk",
      badge: "bg-orange-500 text-white",
      text: "text-orange-600",
      dot: "bg-orange-500",
      hex: "#f97316",
    };
  }
  return {
    label: "Normal",
    badge: "bg-emerald-500 text-white",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    hex: "#10b981",
  };
}
