import { newsStyle } from "@/lib/news";

export default function NewsBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md";
}) {
  const s = newsStyle(score);
  const dim = size === "sm" ? "h-6 min-w-6 text-xs" : "h-8 min-w-8 text-sm";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-1.5 font-bold ${s.badge} ${dim}`}
    >
      {score}
    </span>
  );
}
