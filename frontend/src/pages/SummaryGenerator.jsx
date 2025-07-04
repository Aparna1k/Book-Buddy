import React, { useState } from 'react';
import axios from 'axios';

const SummaryGenerator = () => {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSummary("");

    if (!token) {
      setError("You must be logged in to generate a summary.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/summarize/`,
        { notes },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError(err.response?.data?.summary || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <div className="card shadow">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">🧠 AI Summary Generator</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">Paste your notes:</label>
              <textarea
                rows={6}
                className="form-control"
                placeholder="Enter your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-info w-100"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Summary"}
            </button>
          </form>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              ❌ {error}
            </div>
          )}

          {summary && (
            <div className="alert alert-light mt-4 border">
              <h5>📋 Summary:</h5>
              <p>{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryGenerator;
