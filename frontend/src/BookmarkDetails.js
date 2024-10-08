import React from 'react';
import './App.css';

const BookmarkDetails = ({ bookmark, onBack }) => {
  if (!bookmark) {
    return <p>No bookmark found!</p>;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>{bookmark.title}</h1>
      <p>Date: {bookmark.date}</p>
      <p>URL: <a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a></p>
      <p>Category: {bookmark.category}</p>
      <p>
        Favorite: {bookmark.favorite ? (
          <span style={{ color: 'gold' }}>⭐</span>
        ) : (
          <span>☆</span>
        )}
      </p>
      <button onClick={onBack}>Back to Bookmarks</button>
    </div>
  );
};

export default BookmarkDetails;
