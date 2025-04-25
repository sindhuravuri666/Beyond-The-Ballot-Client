import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  positive: "#22c55e", // green-500
  negative: "#ef4444", // red-500
  neutral: "#3b82f6", // blue-500
};

export default function SummaryDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get_summary")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading summary:", err));
  }, []);

  if (!data) return <p className="text-gray-500 mt-6">Loading summary...</p>;
  if (data.error) return <p className="text-red-500 mt-6">{data.error}</p>;

  const chartData = Object.entries(data.summary).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="bg-white rounded-xl mt-10 p-6 shadow-lg text-gray-800 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        📊 Sentiment Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name} (${value})`}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name.toLowerCase()] || "#cccccc"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Preview Table */}
        <div>
          <h3 className="font-semibold text-lg mb-2">🔍 Preview Samples</h3>
          <ul className="space-y-2 text-sm">
            {data.preview.map((item, idx) => (
              <li
                key={idx}
                className="bg-gray-50 border border-gray-200 p-3 rounded-md flex justify-between items-start"
              >
                <span className="text-gray-700 max-w-xs truncate">
                  📝 {item.Tweet}
                </span>
                <span
                  className={`text-xs font-bold rounded-full px-3 py-1 ${
                    item["Predicted Sentiment"] === "positive"
                      ? "bg-green-100 text-green-600"
                      : item["Predicted Sentiment"] === "negative"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {item["Predicted Sentiment"]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Total Analyzed:{" "}
        <span className="font-semibold text-gray-800">{data.total}</span>
      </p>
    </div>
  );
}
