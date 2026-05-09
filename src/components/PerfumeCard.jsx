import './PerfumeCard.css';

export default function PerfumeCard({ perfume, onOrderClick }) {
  return (
    <div className="perfume-card">
      <div className="perfume-image-wrapper">
        <img
          src={perfume.image_url || 'https://via.placeholder.com/300x400?text=Perfume'}
          alt={perfume.name}
          className="perfume-image"
        />
        {!perfume.available && <div className="out-of-stock">Out of Stock</div>}
      </div>

      <div className="perfume-content">
        <h3 className="perfume-name">{perfume.name}</h3>
        <p className="perfume-category">{perfume.category}</p>
        <p className="perfume-description">{perfume.description}</p>
        <div className="perfume-footer">
          <span className="perfume-price">${Number(perfume.price).toFixed(2)}</span>
          <button
            className={`btn-order ${!perfume.available ? 'disabled' : 'btn-primary'}`}
            onClick={() => onOrderClick(perfume)}
            disabled={!perfume.available}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
