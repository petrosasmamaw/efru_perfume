import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPerfumes, deletePerfume } from '../api/perfumes.js';
import { getOrders } from '../api/orders.js';
import EditPerfumeModal from '../components/EditPerfumeModal.jsx';
import OrdersTable from '../components/OrdersTable.jsx';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('perfumes');
  const [perfumes, setPerfumes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPerfume, setEditingPerfume] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/owner/login');
      return;
    }

    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const perfumesData = await getPerfumes();
      setPerfumes(perfumesData);

      const ordersData = await getOrders(token);
      setOrders(ordersData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePerfume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this perfume?')) {
      return;
    }

    try {
      await deletePerfume(id, token);
      setPerfumes(perfumes.filter(p => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete perfume');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>Owner Dashboard</h2>
          <p>Manage your perfume collection and orders</p>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Sidebar Tabs */}
        <nav className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === 'perfumes' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfumes')}
          >
            💎 Perfumes
          </button>
          <button
            className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders
          </button>
        </nav>

        {/* Main Content */}
        <main className="dashboard-content">
          {error && <div className="error-message">{error}</div>}

          {activeTab === 'perfumes' && (
            <section className="perfumes-tab">
              <div className="tab-header">
                <h3>Perfume Collection</h3>
                <button
                  className="btn-primary"
                  onClick={() => setEditingPerfume({})}
                >
                  ➕ Add Perfume
                </button>
              </div>

              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading perfumes...</p>
                </div>
              ) : perfumes.length === 0 ? (
                <div className="empty-state">
                  <p>No perfumes yet. Add your first perfume!</p>
                </div>
              ) : (
                <div className="perfumes-list">
                  {perfumes.map(perfume => (
                    <div key={perfume.id} className="perfume-row">
                      <div className="perfume-image">
                        <img
                          src={perfume.image_url || 'https://via.placeholder.com/80'}
                          alt={perfume.name}
                        />
                      </div>

                      <div className="perfume-info">
                        <h4>{perfume.name}</h4>
                        <p className="category">{perfume.category}</p>
                        <p className="description">{perfume.description}</p>
                      </div>

                      <div className="perfume-stats">
                        <div className="price">${Number(perfume.price).toFixed(2)}</div>
                        <div className={`availability ${perfume.available ? 'available' : 'unavailable'}`}>
                          {perfume.available ? '✓ Available' : '✗ Out of Stock'}
                        </div>
                      </div>

                      <div className="perfume-actions">
                        <button
                          className="btn-edit"
                          onClick={() => setEditingPerfume(perfume)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeletePerfume(perfume.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'orders' && (
            <section className="orders-tab">
              <div className="tab-header">
                <h3>Customer Orders</h3>
                <span className="order-count">{orders.length} orders</span>
              </div>

              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading orders...</p>
                </div>
              ) : (
                <OrdersTable orders={orders} />
              )}
            </section>
          )}
        </main>
      </div>

      {editingPerfume !== null && (
        <EditPerfumeModal
          perfume={editingPerfume.id ? editingPerfume : null}
          token={token}
          onClose={() => setEditingPerfume(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
