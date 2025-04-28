
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../services/localAuth';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">JobFinder</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Jobs</Link></li>
        {isAuthenticated() ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><span className="username">Hello, {user?.username}</span></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;