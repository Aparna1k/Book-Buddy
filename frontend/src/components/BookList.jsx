import React from 'react';
import { Link } from 'react-router-dom';

const BookList = ({ books, onDelete }) => {
  if (books.length === 0) return <p className="text-muted text-center mt-4">📚 Your personal bookshelf in the cloud.</p>;

  return (
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {books.map((book) => (
          <div className="col" key={book.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                <p className="card-text"><strong>Status:</strong> {book.status}</p>
                <p className="card-text"><strong>Progress:</strong> {book.progress}%</p>
                {book.rating && (
                  <p className="card-text"><strong>Rating:</strong> ⭐ {book.rating}/5</p>
                )}
                {book.notes && (
                  <p className="card-text"><strong>Notes:</strong> {book.notes}</p>
                )}
                {book.ai_review && (
                  <p className="card-text"><strong>🧠 AI Review:</strong> {book.ai_review}</p>
                )}
                {book.estimated_completion && (
                  <p className="card-text text-success"><strong>📅 Estimated Completion:</strong> {book.estimated_completion}</p>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <Link to={`/edit/${book.id}`} className="btn btn-outline-primary btn-sm">✏️ Edit</Link>
                <button onClick={() => onDelete(book.id)} className="btn btn-outline-danger btn-sm">🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
