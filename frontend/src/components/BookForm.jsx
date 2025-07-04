import React, { useState } from 'react';

const BookForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    isbn: initialData.isbn || '',
    title: initialData.title || '',
    author: initialData.author || '',
    genre: initialData.genre || '',
    status: initialData.status || 'reading',
    progress: initialData.progress ?? 0,
    notes: initialData.notes || '',
    rating: initialData.rating ?? '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      isbn: formData.isbn.trim(),
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: formData.genre.trim(),
      status: formData.status,
      progress: parseInt(formData.progress) || 0,
      notes: formData.notes.trim(),
      rating: formData.rating === '' ? null : parseInt(formData.rating)
    };

    onSubmit(formattedData);
  };

  const handleISBNLookup = async () => {
    const isbn = formData.isbn.trim();

    if (!isbn) {
      alert("Please enter a valid ISBN.");
      return;
    }

    try {
      const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
      if (!res.ok) throw new Error("Invalid ISBN");

      const bookData = await res.json();

      let authorName = '';
      if (bookData.authors?.length) {
        const authorKey = bookData.authors[0].key;
        const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`);
        const authorDetails = await authorRes.json();
        authorName = authorDetails.name;
      }

      const genre = Array.isArray(bookData.subjects) && bookData.subjects.length > 0
        ? bookData.subjects[0]
        : formData.genre;

      setFormData((prev) => ({
        ...prev,
        title: bookData.title || prev.title,
        author: authorName || prev.author,
        genre: genre,
        notes: prev.notes || "📚 Auto-filled via ISBN using OpenLibrary"
      }));
    } catch (err) {
      console.error("❌ ISBN lookup failed:", err);
      alert("Failed to fetch book details for this ISBN.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="mb-3 d-flex gap-2">
        <input
          className="form-control"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="ISBN (optional)"
        />
        <button type="button" onClick={handleISBNLookup} className="btn btn-outline-secondary">
          🔍 Autofill via ISBN
        </button>
      </div>

      <div className="mb-3">
        <input className="form-control" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      </div>

      <div className="mb-3">
        <input className="form-control" name="author" value={formData.author} onChange={handleChange} placeholder="Author" required />
      </div>

      <div className="mb-3">
        <input className="form-control" name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" required />
      </div>

      <div className="mb-3">
        <select className="form-select" name="status" value={formData.status} onChange={handleChange} required>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
          <option value="wishlist">Wishlist</option>
        </select>
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          type="number"
          name="progress"
          value={formData.progress}
          onChange={handleChange}
          placeholder="Progress (%)"
          min="0"
          max="100"
        />
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes (optional)"
          rows={3}
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating (1–5)"
          min="1"
          max="5"
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          💾 Save Book
        </button>
      </div>
    </form>
  );
};

export default BookForm;
