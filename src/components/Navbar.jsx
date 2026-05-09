import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const handleOwnerClick = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/owner/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setShowMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Efru_Perfume</h1>
          <p className="navbar-tagline">Wear the Art of Scent</p>
        </div>
        
        <button className="navbar-hamburger" onClick={() => setShowMenu(!showMenu)}>
          ☰
        </button>

        <div className={`navbar-menu ${showMenu ? 'active' : ''}`}>
          <button 
            className="btn-owner"
            onClick={handleOwnerClick}
          >
            {token ? '👤 Dashboard' : '👤 Owner'}
          </button>
          
          {token && (
            <button 
              className="btn-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
