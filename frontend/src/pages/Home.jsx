import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookList from '../components/BookList';

const Home = () => {
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    if (!token) {
      alert("You must be logged in to view your books.");
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
      if (err.response?.status === 401) {
        alert("Session expired or invalid token. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login
      }
    }
  };

  const deleteBook = async (id) => {
    if (!token) return;

    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/books/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchBooks();
      } catch (err) {
        console.error("Failed to delete book:", err);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [token]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-muted text-center mt-4">📚 Your Book List</h2>
        <span className="badge bg-primary fs-6">{books.length} books</span>
      </div>

      <BookList books={books} onDelete={deleteBook} />
    </div>
  );
};

export default Home;
