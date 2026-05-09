import { useState } from 'react';
import { createOrder } from '../api/orders.js';
import './OrderModal.css';

export default function OrderModal({ perfume, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.customer_name || !formData.customer_phone || !formData.customer_address) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      await createOrder({
        perfume_id: perfume.id,
        perfume_name: perfume.name,
        price: perfume.price,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {success ? (
          <div className="success-message">
            <h2>✓ Order Placed Successfully!</h2>
            <p>Thank you for your order of <strong>{perfume.name}</strong></p>
            <p>We'll contact you soon at <strong>{formData.customer_phone}</strong></p>
          </div>
        ) : (
          <>
            <h2>Order {perfume.name}</h2>
            <p className="order-price">Price: ${perfume.price.toFixed(2)}</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  placeholder="Enter your full delivery address"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
