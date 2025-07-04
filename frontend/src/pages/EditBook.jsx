import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BookForm from '../components/BookForm';
import ProgressChart from '../components/ProgressChart';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/books/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setBookData(res.data);
      } catch (err) {
        console.error("Error fetching book:", err);
        alert("Failed to load book data.");
      }
    };
    fetchBook();
  }, [id, token]);

  const handleUpdateBook = async (updatedData) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/books/${id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("✅ Book updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error updating book:", err);
      alert("❌ Failed to update book.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h4 className="mb-0">✏️ Edit Book</h4>
        </div>
        <div className="card-body">
          {bookData ? (
            <>
              {bookData.estimated_completion && (
                <p className="text-muted mb-3">
                  <strong>📅 Estimated Completion:</strong> {bookData.estimated_completion}
                </p>
              )}

              <div className="mb-4">
                <h6>📈 Progress Chart</h6>
                <ProgressChart bookId={id} />
              </div>

              <BookForm onSubmit={handleUpdateBook} initialData={bookData} />
            </>
          ) : (
            <p>Loading book data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBook;
