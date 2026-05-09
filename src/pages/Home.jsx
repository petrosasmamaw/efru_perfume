import { useState, useEffect } from 'react';
import { getPerfumes } from '../api/perfumes.js';
import PerfumeCard from '../components/PerfumeCard.jsx';
import OrderModal from '../components/OrderModal.jsx';
import './Home.css';

export default function Home() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      const data = await getPerfumes();
      setPerfumes(data);
      setError('');
    } catch (err) {
      setError('Failed to load perfumes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Efru_Perfume</h1>
          <p className="hero-tagline">Wear the Art of Scent</p>
          <p className="hero-subtitle">Discover our curated collection of luxury fragrances</p>
        </div>
        <div className="hero-decoration"></div>
      </section>

      {/* Perfumes Section */}
      <section className="section perfumes-section">
        <div className="container">
          <h2 className="section-title">Our Collection</h2>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading perfumes...</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!loading && perfumes.length === 0 && (
            <div className="empty-state">
              <p>No perfumes available at the moment</p>
            </div>
          )}

          {!loading && perfumes.length > 0 && (
            <div className="perfumes-grid">
              {perfumes.map(perfume => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  onOrderClick={setSelectedPerfume}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedPerfume && (
        <OrderModal
          perfume={selectedPerfume}
          onClose={() => setSelectedPerfume(null)}
          onSuccess={fetchPerfumes}
        />
      )}
    </main>
  );
}
