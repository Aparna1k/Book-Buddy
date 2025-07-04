import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/recommend/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGenre(res.data.recommended_genre || "");
        setRecommendations(res.data.recommendations || []);
      } catch (err) {
        console.error("Error getting recommendations", err);
        setError("Failed to load recommendations. Please try again.");
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [token]);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">📚 AI Book Recommendations</h4>
        </div>

        <div className="card-body">
          {loading && (
            <div className="text-muted">Loading recommendations...</div>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && (
            <>
              {genre && (
                <p className="mb-3">
                  Based on your reading history in <strong>{genre}</strong> genre:
                </p>
              )}

              {recommendations.length > 0 ? (
                <ul className="list-group">
                  {recommendations.map((book, idx) => (
                    <li key={idx} className="list-group-item">
                      <strong>{book.title}</strong> by {book.author} <span className="badge bg-secondary ms-2">{book.source}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recommendations available at this time.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
