// components/BarChart.tsx
"use client";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { getLast7Days, labels } from "@/feature/feature";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  PointElement,
  LinearScale,
  BarElement
);

interface BarChartProps {
  values: number[];
}

interface LineChartProps {
  values: number[];
}

function BarChart({ values }: BarChartProps) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Courses Data",
        data: values,
        backgroundColor: "#a435f0",
        borderColor: "#a435f0",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        color: "#a435f0",
        font: {
          size: 20,
        },
      },
    },
  };

  return <Bar data={data} options={options} className="chart" />;
}

export default function LineChart({ values }: LineChartProps) {
  const data = {
    labels: getLast7Days(),
    datasets: [
      {
        label: "Sales Growth",
        data: values,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,

        color: "rgba(75, 192, 192, 1)",
        font: {
          size: 20,
        },
      },
    },
  };

  return <Line data={data} options={options} className="chart" />;
}

export { BarChart };
