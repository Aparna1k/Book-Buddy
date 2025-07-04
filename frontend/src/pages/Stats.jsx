import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import StatsDashboard from '../components/StatsDashboard';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Stats = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setError("You must be logged in to view statistics.");
        return;
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/books/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("You must be logged in to view statistics.");
      }
    };

    fetchStats();
  }, [token]);

  const genreCounts = {};
  let completed = 0;

  books.forEach(book => {
    genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    if (book.status === 'completed') completed++;
  });

  const genreChart = {
    labels: Object.keys(genreCounts),
    datasets: [{
      label: 'Books by Genre',
      data: Object.values(genreCounts),
      backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#facc15', '#c084fc']
    }]
  };

  const percentCompleted = books.length > 0 ? Math.round((completed / books.length) * 100) : 0;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">📊 Reading Statistics</h4>
        </div>
        <div className="card-body">
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <StatsDashboard
                chartData={genreChart}
                total={books.length}
                completed={completed}
                percent={percentCompleted}
              />

              <h5 className="mt-4">📅 Estimated Completion per Book</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-striped mt-2">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Progress (%)</th>
                      <th>Estimated Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.status}</td>
                        <td>{book.progress}</td>
                        <td>{book.estimated_completion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
