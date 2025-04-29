import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#34d399", "#60a5fa", "#f87171"]; // green, blue, red

const fetchSummary = async (type) => {
  const routeMap = {
    modi: "https://beyond-the-ballot-server.onrender.com/get_summary_modi",
    rahul: "https://beyond-the-ballot-server.onrender.com/get_summary_rahul",
  };
  const response = await axios.get(routeMap[type]);
  return response.data;
};

const SummaryCard = ({ title, data }) => {
  const { summary, total, preview } = data;

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
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full text-white shadow-lg flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-center">{title}</h2>

      <div className="grid grid-cols-1 gap-4">
        <div className="text-center">
          <p className="text-lg">Total Tweets</p>
          <p className="text-4xl font-bold">{total}</p>
        </div>

        <div className="flex justify-around">
          {sentimentPercentages.map((item, idx) => (
            <div key={idx} className="text-center">
              <p className="capitalize">{item.name}</p>
              <p className="font-bold">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-4 text-gray-800">
          <h3 className="font-bold text-center mb-2">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
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
        <div className="bg-white rounded-xl p-4 text-gray-800">
          <h3 className="font-bold text-center mb-2">Sentiment Proportion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
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
      <div className="bg-white rounded-xl p-4 text-gray-800">
        <h3 className="font-bold text-center mb-2">Top Tweets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1">Tweet</th>
                <th className="px-2 py-1">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {preview.slice(0, 5).map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-2 py-1">{item.Tweet}</td>
                  <td className="px-2 py-1 capitalize">
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

const ComparisonDashboard = () => {
  const [modiData, setModiData] = useState(null);
  const [rahulData, setRahulData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [modi, rahul] = await Promise.all([
          fetchSummary("modi"),
          fetchSummary("rahul"),
        ]);
        setModiData(modi);
        setRahulData(rahul);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    loadData();
  }, []);

  if (!modiData || !rahulData) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        Loading Comparison...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col gap-8 items-center text-white">
      <h1 className="text-4xl font-bold">
        Modi 🆚 Rahul: Sentiment Comparison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl">
        <SummaryCard title="Modi" data={modiData} />
        <SummaryCard title="Rahul Gandhi" data={rahulData} />
      </div>
    </div>
  );
};

export default ComparisonDashboard;
