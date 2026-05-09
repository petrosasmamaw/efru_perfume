import './OrdersTable.css';

export default function OrdersTable({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <p>No orders yet. Sit back and relax! 😌</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Perfume</th>
              <th>Price</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td>{order.perfume_name}</td>
                <td className="price">${order.price.toFixed(2)}</td>
                <td>{order.customer_name}</td>
                <td>{order.customer_phone}</td>
                <td>{order.customer_address}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="orders-mobile">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span className="order-id">Order #{order.id}</span>
              <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="order-card-body">
              <p><strong>Perfume:</strong> {order.perfume_name}</p>
              <p><strong>Price:</strong> ${order.price.toFixed(2)}</p>
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Phone:</strong> {order.customer_phone}</p>
              <p><strong>Address:</strong> {order.customer_address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
