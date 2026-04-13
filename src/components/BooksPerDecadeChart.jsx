import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function BooksPerDecadeChart({ books }) {
  const data = useMemo(() => {
    const decades = {};
    books.forEach((b) => {
      const year = b.first_publish_year;
      if (!year) return;
      const decade = Math.floor(year / 10) * 10;
      decades[decade] = (decades[decade] || 0) + 1;
    });
    return Object.entries(decades)
      .map(([decade, count]) => ({ decade: `${decade}s`, count }))
      .sort((a, b) => a.decade.localeCompare(b.decade));
  }, [books]);

  if (data.length === 0) return <p>Loading chart...</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
        <XAxis dataKey="decade" stroke="#fff" fontSize={12} />
        <YAxis stroke="#fff" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "rgba(0,0,0,0.75)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
          }}
        />
        <Bar dataKey="count" fill="rgba(255,255,255,0.7)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
