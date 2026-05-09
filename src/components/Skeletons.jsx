import './Skeletons.css';

function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton-block ${className}`.trim()} aria-hidden="true" />;
}

export function HomePerfumesSkeleton({ count = 6 }) {
  return (
    <div className="perfumes-grid skeleton-home-grid" aria-label="Loading perfumes">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="perfume-card skeleton-card">
          <SkeletonBlock className="skeleton-card-image" />
          <div className="perfume-content skeleton-card-content">
            <SkeletonBlock className="skeleton-line skeleton-title" />
            <SkeletonBlock className="skeleton-line skeleton-category" />
            <SkeletonBlock className="skeleton-line skeleton-description" />
            <div className="skeleton-card-footer">
              <SkeletonBlock className="skeleton-price" />
              <SkeletonBlock className="skeleton-button" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardPerfumesSkeleton({ count = 4 }) {
  return (
    <div className="perfumes-list skeleton-dashboard-perfumes" aria-label="Loading dashboard perfumes">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="perfume-row skeleton-perfume-row">
          <SkeletonBlock className="skeleton-thumb" />

          <div className="skeleton-perfume-info">
            <SkeletonBlock className="skeleton-line skeleton-name" />
            <SkeletonBlock className="skeleton-line skeleton-category" />
            <SkeletonBlock className="skeleton-line skeleton-description" />
          </div>

          <div className="skeleton-stats">
            <SkeletonBlock className="skeleton-price" />
            <SkeletonBlock className="skeleton-availability" />
          </div>

          <div className="skeleton-actions">
            <SkeletonBlock className="skeleton-icon-btn" />
            <SkeletonBlock className="skeleton-icon-btn" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardOrdersSkeleton({ count = 5 }) {
  return (
    <div className="orders-skeleton" aria-label="Loading orders">
      <div className="orders-skeleton-table">
        <div className="orders-skeleton-row orders-skeleton-header">
          {Array.from({ length: 7 }).map((_, index) => (
            <SkeletonBlock key={index} className="skeleton-line skeleton-table-header-cell" />
          ))}
        </div>

        {Array.from({ length: count }).map((_, rowIndex) => (
          <div key={rowIndex} className="orders-skeleton-row">
            {Array.from({ length: 7 }).map((_, cellIndex) => (
              <SkeletonBlock key={cellIndex} className="skeleton-line skeleton-table-cell" />
            ))}
          </div>
        ))}
      </div>

      <div className="orders-skeleton-mobile">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="order-card skeleton-mobile-order-card">
            <SkeletonBlock className="skeleton-line skeleton-mobile-header" />
            <SkeletonBlock className="skeleton-line skeleton-mobile-line" />
            <SkeletonBlock className="skeleton-line skeleton-mobile-line" />
            <SkeletonBlock className="skeleton-line skeleton-mobile-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
