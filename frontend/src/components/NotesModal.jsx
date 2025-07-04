import React from 'react';

const NotesModal = ({ isOpen, onClose, notes, rating, onChange, onSave }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', width: '300px' }}>
        <h3>Edit Notes & Rating</h3>
        <textarea
          name="notes"
          rows={4}
          value={notes}
          onChange={onChange}
          placeholder="Enter notes"
          style={{ width: '100%' }}
        />
        <input
          type="number"
          name="rating"
          value={rating}
          onChange={onChange}
          min={1}
          max={5}
          placeholder="Rating (1-5)"
          style={{ marginTop: '10px', width: '100%' }}
        />
        <div style={{ marginTop: '10px' }}>
          <button onClick={onSave}>Save</button>
          <button onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
