import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "rgba(255,255,255,0.8)",
  "rgba(200,180,255,0.8)",
  "rgba(150,200,255,0.8)",
  "rgba(255,200,150,0.8)",
];

const RANGES = [
  { label: "1–5 editions", min: 1, max: 5 },
  { label: "6–20 editions", min: 6, max: 20 },
  { label: "21–50 editions", min: 21, max: 50 },
  { label: "50+ editions", min: 51, max: Infinity },
];

export default function EditionDistributionChart({ books }) {
  const data = useMemo(() => {
    return RANGES.map((range) => ({
      name: range.label,
      value: books.filter(
        (b) => b.edition_count >= range.min && b.edition_count <= range.max
      ).length,
    })).filter((d) => d.value > 0);
  }, [books]);

  if (data.length === 0) return <p>Loading chart...</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
          labelLine={true}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "rgba(0,0,0,0.75)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
          }}
        />
        <Legend wrapperStyle={{ color: "#fff", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
