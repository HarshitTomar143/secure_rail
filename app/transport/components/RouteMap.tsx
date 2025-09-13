'use client'

import { useEffect, useRef } from 'react'
import '../transport.css'

interface Checkpoint {
  number: number
  location: { latitude: number; longitude: number } | null
  timestamp: string | null
  address?: string
}

interface RouteMapProps {
  checkpoints: Checkpoint[]
  origin?: { latitude: number; longitude: number }
  destination?: { latitude: number; longitude: number }
}

export default function RouteMap({ checkpoints, origin, destination }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // For now, we'll create a simple visual representation
    // In production, you would integrate with Google Maps or Mapbox
    renderSimpleMap()
  }, [checkpoints])

  const renderSimpleMap = () => {
    if (!mapRef.current) return

    // Create a simple SVG-based visualization
    const completedCheckpoints = checkpoints.filter(cp => cp.location !== null)
    
    const svgContent = `
      <svg width="100%" height="300" viewBox="0 0 800 300" style="background: #f0f4f8; border-radius: 8px;">
        <!-- Route line -->
        <line x1="100" y1="150" x2="700" y2="150" stroke="#dee2e6" stroke-width="4" stroke-dasharray="10,5" />
        
        <!-- Start point -->
        <circle cx="100" cy="150" r="15" fill="#28a745" />
        <text x="100" y="190" text-anchor="middle" fill="#495057" font-size="12" font-weight="600">START</text>
        
        <!-- Checkpoints -->
        ${checkpoints.map((cp, index) => {
          const x = 250 + (index * 150)
          const isCompleted = cp.location !== null
          const color = isCompleted ? '#17a2b8' : '#dee2e6'
          
          return `
            <circle cx="${x}" cy="150" r="12" fill="${color}" />
            <text x="${x}" y="135" text-anchor="middle" fill="#495057" font-size="14" font-weight="600">CP${cp.number}</text>
            ${isCompleted ? `
              <text x="${x}" y="190" text-anchor="middle" fill="#6c757d" font-size="10">
                ${new Date(cp.timestamp!).toLocaleTimeString()}
              </text>
            ` : ''}
          `
        }).join('')}
        
        <!-- End point -->
        <circle cx="700" cy="150" r="15" fill="#dc3545" />
        <text x="700" y="190" text-anchor="middle" fill="#495057" font-size="12" font-weight="600">DEST</text>
        
        <!-- Progress indicator -->
        ${completedCheckpoints.length > 0 ? `
          <line x1="100" y1="150" x2="${100 + (completedCheckpoints.length * 200)}" y2="150" 
                stroke="#28a745" stroke-width="4" opacity="0.7" />
        ` : ''}
      </svg>
    `

    mapRef.current.innerHTML = svgContent
  }

  const getMapUrl = () => {
    // Generate a static map URL with markers for completed checkpoints
    const completedCheckpoints = checkpoints.filter(cp => cp.location !== null)
    
    if (completedCheckpoints.length === 0) {
      return null
    }

    // For OpenStreetMap static image (or you can use Google Static Maps API)
    const markers = completedCheckpoints.map(cp => 
      `${cp.location!.latitude},${cp.location!.longitude}`
    ).join('|')

    return `https://www.openstreetmap.org/export/embed.html?bbox=${markers}`
  }

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div className="card-header">
        <h3 className="card-title">Route Progress</h3>
      </div>
      
      <div ref={mapRef} style={{ padding: '1rem' }}></div>
      
      <div style={{ padding: '1rem', borderTop: '1px solid #dee2e6' }}>
        <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
          <strong>Checkpoints Completed:</strong> {checkpoints.filter(cp => cp.location !== null).length} / {checkpoints.length}
        </div>
        
        {checkpoints.filter(cp => cp.location !== null).map(cp => (
          <div key={cp.number} style={{ 
            marginTop: '0.5rem', 
            padding: '0.5rem', 
            background: '#f8f9fa', 
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            <div style={{ fontWeight: 600, color: '#17a2b8' }}>
              Checkpoint {cp.number}
            </div>
            <div style={{ color: '#6c757d', marginTop: '0.25rem' }}>
              📍 {cp.address || `${cp.location!.latitude.toFixed(4)}, ${cp.location!.longitude.toFixed(4)}`}
            </div>
            <div style={{ color: '#6c757d', marginTop: '0.25rem' }}>
              🕐 {new Date(cp.timestamp!).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ padding: '1rem', background: '#e7f3ff', borderTop: '1px solid #dee2e6' }}>
        <p style={{ fontSize: '0.875rem', color: '#004085', margin: 0 }}>
          💡 <strong>Tip:</strong> Each checkpoint must be verified by scanning the batch QR code. 
          Location is automatically captured during scanning.
        </p>
      </div>
    </div>
  )
}
