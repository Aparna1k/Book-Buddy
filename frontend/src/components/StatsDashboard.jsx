import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';

const StatsDashboard = ({ chartData, total, completed, percent }) => {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">📊 Reading Statistics</h5>
              <p className="card-text"><strong>Total Books:</strong> {total}</p>
              <p className="card-text"><strong>Completed:</strong> {completed} ({percent}%)</p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">📘 Books by Genre (Pie)</h6>
                  <Pie data={chartData} />
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">📚 Books by Genre (Bar)</h6>
                  <Bar data={chartData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
