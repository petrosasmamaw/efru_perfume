import { useState, useEffect } from 'react';
import { getPerfumes } from '../api/perfumes.js';
import PerfumeCard from '../components/PerfumeCard.jsx';
import OrderModal from '../components/OrderModal.jsx';
import { HomePerfumesSkeleton } from '../components/Skeletons.jsx';
import './Home.css';

export default function Home() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const availablePerfumes = perfumes.filter((perfume) => perfume.available === true);

  const filteredPerfumes = availablePerfumes.filter((perfume) =>
    perfume.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

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
          <div className="collection-header">
            <h2 className="section-title">Our Collection</h2>
            <div className="collection-search">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by perfume name"
                aria-label="Search perfumes by name"
              />
            </div>
          </div>

          {loading && (
            <HomePerfumesSkeleton />
          )}

          {error && <div className="error-message">{error}</div>}

          {!loading && perfumes.length === 0 && (
            <div className="empty-state">
              <p>No perfumes available at the moment</p>
            </div>
          )}

          {!loading && perfumes.length > 0 && availablePerfumes.length === 0 && (
            <div className="empty-state">
              <p>No perfumes available at the moment</p>
            </div>
          )}

          {!loading && availablePerfumes.length > 0 && filteredPerfumes.length === 0 && (
            <div className="empty-state">
              <p>No perfume found for "{searchTerm}"</p>
            </div>
          )}

          {!loading && filteredPerfumes.length > 0 && (
            <div className="perfumes-grid">
              {filteredPerfumes.map((perfume) => (
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
