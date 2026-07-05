import { ChevronRight } from "lucide-react";

interface TrendChartProps {
  data: number[];
  labels?: string[];
}

/** Lightweight hand-rolled SVG line chart (no chart library dependency). */
export default function TrendChart({ data, labels }: TrendChartProps) {
  const width = 240;
  const height = 70;
  const padX = 8;
  const padY = 10;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padX + (i * (width - padX * 2)) / (data.length - 1);
    const y = padY + (height - padY * 2) * (1 - (v - min) / range);
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height - padY} ` +
    `L ${points[0].x.toFixed(1)} ${height - padY} Z`;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">แนวโน้ม 3 วัน</p>
        <button
          type="button"
          className="flex items-center text-[11px] font-medium text-blue-600 hover:underline"
        >
          ดูเพิ่มเติม
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[70px] w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="กราฟแนวโน้มจำนวนผู้ป่วย"
      >
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trendFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.5}
            fill="#fff"
            stroke="#3b82f6"
            strokeWidth={1.5}
          />
        ))}
      </svg>

      {labels ? (
        <div className="mt-1 flex justify-between text-[9px] text-slate-400">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
