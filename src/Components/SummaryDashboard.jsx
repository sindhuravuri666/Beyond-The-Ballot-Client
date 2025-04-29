import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#34d399", "#60a5fa", "#f87171"]; // green, blue, red for positive, neutral, negative

const SummaryDashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState("general"); // Default to general summary

  useEffect(() => {
    const fetchSummary = async () => {
      let url;
      if (selectedRoute === "modi") {
        url = "https://beyond-the-ballot-server.onrender.com/get_summary_modi";
      } else if (selectedRoute === "rahul") {
        url = "https://beyond-the-ballot-server.onrender.com/get_summary_rahul";
      } else {
        url = "https://beyond-the-ballot-server.onrender.com/get_summary";
      }

      try {
        const response = await axios.get(url);
        setSummaryData(response.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, [selectedRoute]);

  if (!summaryData) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        Loading Dashboard...
      </div>
    );
  }

  const { summary, total, preview } = summaryData;

  const chartData = Object.entries(summary).map(([sentiment, count]) => ({
    name: sentiment,
    value: count,
  }));

  const sentimentPercentages = Object.entries(summary).map(
    ([sentiment, count]) => ({
      name: sentiment,
      percentage: ((count / total) * 100).toFixed(1),
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col gap-8 items-center text-white">
      {/* Dropdown to select route */}
      <div className="mb-6">
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="p-2 rounded-lg bg-white text-gray-800"
        >
          <option value="general">General Summary</option>
          <option value="modi">Modi's Tweets</option>
          <option value="rahul">Rahul Gandhi's Tweets</option>
        </select>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        <div className="bg-white text-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-bold">Total Tweets</h2>
          <p className="mt-2 text-4xl">{total}</p>
        </div>
        {sentimentPercentages.map((item, index) => (
          <div
            key={index}
            className="bg-white text-gray-800 rounded-xl p-6 shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold capitalize">{item.name}</h2>
            <p className="mt-2 text-4xl">{item.percentage}%</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sentiment Distribution (Bar)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sentiment Proportion (Pie)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Top Tweets Preview
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left">Tweet</th>
                <th className="px-4 py-2 text-left">Predicted Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-3 text-gray-700">{item.Tweet}</td>
                  <td className="px-4 py-3 text-gray-700 capitalize">
                    {item["Predicted Sentiment"]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
