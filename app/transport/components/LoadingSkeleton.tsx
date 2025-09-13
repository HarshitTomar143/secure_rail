'use client'

import '../transport.css'

export default function LoadingSkeleton() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="skeleton-shimmer" style={{ 
            height: '24px', 
            width: '200px',
            borderRadius: '4px'
          }} />
        </div>
        <div className="batch-info">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="info-row">
              <div className="skeleton-item" style={{ 
                height: '16px', 
                width: '80px',
                borderRadius: '4px'
              }} />
              <div className="skeleton-item" style={{ 
                height: '16px', 
                width: '120px',
                borderRadius: '4px'
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
