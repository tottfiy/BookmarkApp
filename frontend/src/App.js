import axios from "axios";
import React, { useEffect, useState } from 'react';
import './App.css';
import BookmarkDetails from './BookmarkDetails';
import Login from './Login'; // Import the Login component
import Signup from './Signup'; // Import the Signup component

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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [showSignup, setShowSignup] = useState(false); // Track if signup form should be displayed
  const [username, setUsername] = useState(''); // Track the username

  // Fetch bookmarks when the component mounts or when login status changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchBookmarks();
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.error('No refresh token found for logout');
        return;
      }

      await axios.post('http://localhost:8000/auth/logout', {
        refresh: refreshToken
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Clear the tokens from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      setUsername(''); // Clear username on logout
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

const fetchBookmarks = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found for fetching bookmarks');
    setError('You need to log in first.');
    return; // Stop execution if there's no token
  }

  try {
    const response = await axios.get('http://localhost:8000/bookmarks/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setBookmarks(response.data); // Set bookmarks state
    setLoading(false); // Stop loading after bookmarks are fetched
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    setError(err.message); // Set error message
  }
};


const addBookmark = async (e) => {
  e.preventDefault(); // Prevent the default form submission
  const token = localStorage.getItem('token');

  try {
    const response = await axios.post('http://localhost:8000/bookmarks/', {
      title: newBookmark.title,  // Include title
      url: newBookmark.url,      // Include URL
      category: newBookmark.category, // Include category
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in headers
      },
    });
    setBookmarks([...bookmarks, response.data]); // Add new bookmark to state
    setNewBookmark({ title: '', url: '', category: '', favorite: false }); // Reset newBookmark state
  } catch (err) {
    console.error('Error adding bookmark:', err.response.data); // Log error response
    setError(err.response.data); // Set error message
  }
};



  const deleteBookmark = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/bookmarks/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id)); // Remove deleted bookmark
    } catch (err) {
      setError(err.message); // Set error message
    }
  };

  const handleTitleClick = (bookmark) => {
    setSelectedBookmark(bookmark); // Set selected bookmark
  };

  const handleBackToList = () => {
    setSelectedBookmark(null); // Clear selected bookmark
  };

  const toggleFavorite = (id) => {
    setBookmarks((prevBookmarks) => {
      const updatedBookmarks = prevBookmarks.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, favorite: !bookmark.favorite } : bookmark
      );

      const favorites = updatedBookmarks.filter((bookmark) => bookmark.favorite);
      localStorage.setItem('bookmarks', JSON.stringify(favorites)); // Store favorites in local storage

      return updatedBookmarks;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBookmark({ ...newBookmark, [name]: value });
  };

 const handleLogin = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:8000/auth/login/', credentials);
    console.log('Login response:', response.data);

    if (response.data.access && response.data.refresh) {
      // Adjust according to the actual response structure
      setUsername(response.data.username || response.data.user.username); // Check if username is in root or nested
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_id', response.data.user_id); // Store user ID
      setIsLoggedIn(true);
      fetchBookmarks();
    } else {
      console.error('Access or refresh token not found in the response.');
      setError('Login failed. Token not provided.');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Login failed. Please check your credentials.');
  }
};


  const handleSignupRedirect = () => {
    setShowSignup(true); // Set to true to show the signup form
  };

  return (
    <div>
      {error && <p className="error">{error}</p>} {/* Display error messages */}

      {/* Welcome message in the top right corner */}
      {isLoggedIn && (
        <div className="welcome-message">
          Welcome, {username}
        </div>
      )}

      {isLoggedIn ? (
        <div>
          <h1>Bookmarks</h1>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
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
                <span className="star" onClick={() => toggleFavorite(bookmark.id)}>
                  {bookmark.favorite ? <span>⭐</span> : <span>☆</span>}
                </span>
                <button className="button" onClick={() => deleteBookmark(bookmark.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ) : showSignup ? (
        <Signup handleLogin={handleLogin} /> // Render Signup component and pass handleLogin
      ) : (
        <Login handleLogin={handleLogin} handleSignupRedirect={handleSignupRedirect} /> // Pass handleLogin and handleSignupRedirect to Login
      )}
    </div>
  );
};

export default App;
