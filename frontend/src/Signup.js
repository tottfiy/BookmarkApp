// Signup.js
import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ handleLogin }) => { // Accept handleLogin as a prop
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      // Sign up the user
      const response = await axios.post('http://localhost:8000/auth/signup/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      console.log('Signup response:', response.data);

      // After successful signup, log in the user
      await handleLogin({
        username: formData.username,
        password: formData.password,
      });

    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please check your inputs.'); // Set error message for signup
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;
