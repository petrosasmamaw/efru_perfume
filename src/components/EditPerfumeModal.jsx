import { useState, useEffect } from 'react';
import { createPerfume, updatePerfume } from '../api/perfumes.js';
import './EditPerfumeModal.css';

const CATEGORIES = ["Girl's", "Boy's", 'Both'];

export default function EditPerfumeModal({ perfume, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    image_url: '',
    available: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (perfume) {
      setFormData({
        name: perfume.name,
        category: perfume.category,
        description: perfume.description || '',
        price: Number(perfume.price).toString(),
        image_url: perfume.image_url || '',
        available: perfume.available !== false,
      });
    }
  }, [perfume]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.category || !formData.price) {
      setError('Name, category, and price are required');
      setLoading(false);
      return;
    }

    try {
      if (perfume) {
        await updatePerfume(perfume.id, formData);
      } else {
        await createPerfume(formData);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save perfume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2>{perfume ? 'Edit Perfume' : 'Add New Perfume'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Perfume Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter perfume name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter perfume description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (Birr) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Availability</label>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  id="available"
                />
                <label htmlFor="available" className="checkbox-label">
                  Available for order
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.image_url && (
            <div className="image-preview">
              <img src={formData.image_url} alt="Preview" />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Perfume'}
            </button>
            <button
              type="button"
              className="btn-dark"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
