import React from 'react';
import axios from 'axios';
import BookForm from '../components/BookForm';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAddBook = async (data) => {
    try {
      console.log("📤 Submitting Book:", data);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/books/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("✅ Book added successfully!");
      navigate("/");
    } catch (error) {
      console.error("❌ Error adding book:", error);

      const isJson = error.response?.headers?.["content-type"]?.includes("application/json");

      if (error.response?.data && isJson) {
        const serverErrors = Object.entries(error.response.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join("\n");
        alert("Server Validation Error:\n" + serverErrors);
      } else {
        console.warn("Server raw error response:", error.response?.data);
        alert(`⚠️ Server Error (${error.response?.status || 'unknown'}):\n${error.response?.statusText || 'Something went wrong.'}`);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">📘 Add New Book</h4>
        </div>
        <div className="card-body">
          <BookForm onSubmit={handleAddBook} />
        </div>
      </div>
    </div>
  );
};

export default AddBook;
