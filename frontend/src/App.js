import axios from "axios";
import React, { useEffect, useState } from 'react';
import './App.css';
import BookmarkDetails from './BookmarkDetails';

const App = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    category: '',
    favorite: false
  });
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/');
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        const bookmarksWithFavorites = response.data.map(bookmark => {
          const isFavorite = savedBookmarks.some(savedBookmark => savedBookmark.id === bookmark.id);
          return { ...bookmark, favorite: isFavorite };
        });
        setBookmarks(bookmarksWithFavorites);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBookmark({ ...newBookmark, [name]: value });
  };

  const addBookmark = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/', newBookmark);
      setBookmarks([...bookmarks, response.data]);
      setNewBookmark({ title: '', url: '', category: '', favorite: false });
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/${id}/`);
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTitleClick = (bookmark) => {
    setSelectedBookmark(bookmark);
  };

  const handleBackToList = () => {
    setSelectedBookmark(null);
  };

  const toggleFavorite = (id) => {
    setBookmarks((prevBookmarks) => {
      const updatedBookmarks = prevBookmarks.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, favorite: !bookmark.favorite } : bookmark
      );

      const favorites = updatedBookmarks.filter((bookmark) => bookmark.favorite);
      localStorage.setItem('bookmarks', JSON.stringify(favorites));

      return updatedBookmarks;
    });
  };

  if (loading) {
    return <p>Loading bookmarks...</p>;
  }

  if (error) {
    return <p>Error loading bookmarks: {error}</p>;
  }

  if (selectedBookmark) {
    return (
      <BookmarkDetails
        bookmark={selectedBookmark}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div>
      <h1>Bookmarks</h1>
      <form onSubmit={addBookmark}>
        <input
          type="text"
          name="title"
          value={newBookmark.title}
          onChange={handleInputChange}
          placeholder="Title"
          required
        />
        <input
          type="url"
          name="url"
          value={newBookmark.url}
          onChange={handleInputChange}
          placeholder="URL"
          required
        />
        <input
          type="text"
          name="category"
          value={newBookmark.category}
          onChange={handleInputChange}
          placeholder="Category"
          required
        />
        <button type="submit">Add Bookmark</button>
      </form>

      <ul>
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <h2 onClick={() => handleTitleClick(bookmark)} style={{ cursor: 'pointer', color: 'blue' }}>
              {bookmark.title}
            </h2>
            <p>Date: {bookmark.date}</p>
            <p>URL: <a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a></p>
            <p>Category: {bookmark.category}</p>
            <span
              className="star"
              onClick={() => toggleFavorite(bookmark.id)}
            >
              {bookmark.favorite ? (
                <span>⭐</span>
              ) : (
                <span>☆</span>
              )}
            </span>
            <button className="button" onClick={() => deleteBookmark(bookmark.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
