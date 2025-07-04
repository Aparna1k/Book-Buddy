import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register required Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const ProgressChart = ({ bookId }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAndRender = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/books/${bookId}/progress/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!data.history || !Array.isArray(data.history)) {
          console.warn("📭 No history data found or malformed response:", data);
          return;
        }

        const labels = data.history.map(entry => entry.date);
        const points = data.history.map(entry => entry.progress);

        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart(canvasRef.current, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "📈 Reading Progress (%)",
                data: points,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.2)",
                tension: 0.3,
                fill: true,
                pointRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                min: 0,
                max: 100,
                ticks: { stepSize: 20 },
                title: { display: true, text: "Progress (%)" },
              },
              x: {
                title: { display: true, text: "Date" },
              },
            },
          },
        });
      } catch (error) {
        console.error("❌ Error fetching progress data:", error);
      }
    };

    fetchAndRender();

    // 🧼 Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [bookId]);

  return <canvas ref={canvasRef}></canvas>;
};

export default ProgressChart;
