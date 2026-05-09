import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkOwnerSession, logoutOwner } from '../api/auth.js';
import './Navbar.css';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await checkOwnerSession();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, [location.pathname]);

  const handleOwnerClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/owner/login');
    }
    setShowMenu(false);
  };

  const handleHomeClick = () => {
    setShowMenu(false);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await logoutOwner();
    } catch {
      // Ignore logout request errors and clear UI state.
    }

    setIsAuthenticated(false);
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
            {isAuthenticated ? '👤 Dashboard' : '👤 Owner'}
          </button>
          
          {isAuthenticated && (
            <>
              <button
                className="btn-home"
                onClick={handleHomeClick}
              >
                Home
              </button>

              <button 
                className="btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
