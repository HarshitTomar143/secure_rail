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
      <svg width="100%" height="350" viewBox="0 0 900 350" style="background: #f8f9fa; border-radius: 8px;">
        <!-- Route line background -->
        <line x1="100" y1="175" x2="800" y2="175" stroke="#dee2e6" stroke-width="6" stroke-linecap="round" />
        <line x1="100" y1="175" x2="800" y2="175" stroke="#e9ecef" stroke-width="3" stroke-dasharray="12,8" stroke-linecap="round" />
        
        <!-- Stage 1: Dispatch -->
        <circle cx="100" cy="175" r="28" fill="#0055aa" stroke="white" stroke-width="3" />
        <text x="100" y="183" text-anchor="middle" fill="white" font-size="20" font-weight="bold">1</text>
        <text x="100" y="130" text-anchor="middle" fill="#003366" font-size="16" font-weight="700">STAGE 1</text>
        <text x="100" y="230" text-anchor="middle" fill="#003366" font-size="14" font-weight="600">DISPATCH</text>
        
        <!-- Stages 2-4: Checkpoints -->
        ${checkpoints.map((cp, index) => {
          const x = 250 + (index * 150)
          const isCompleted = cp.location !== null
          const fillColor = isCompleted ? '#0055aa' : '#dee2e6'
          const textColor = isCompleted ? 'white' : '#6c757d'
          const stageNum = index + 2  // Stages 2, 3, 4
          
          return `
            <circle cx="${x}" cy="175" r="24" fill="${fillColor}" stroke="white" stroke-width="3" />
            <text x="${x}" y="183" text-anchor="middle" fill="${textColor}" font-size="18" font-weight="bold">${stageNum}</text>
            <text x="${x}" y="130" text-anchor="middle" fill="#003366" font-size="14" font-weight="700">STAGE ${stageNum}</text>
            <text x="${x}" y="230" text-anchor="middle" fill="#495057" font-size="13" font-weight="600">CHECKPOINT ${cp.number}</text>
            ${isCompleted ? `
              <text x="${x}" y="250" text-anchor="middle" fill="#6c757d" font-size="11">
                ${new Date(cp.timestamp!).toLocaleTimeString()}
              </text>
            ` : `
              <text x="${x}" y="250" text-anchor="middle" fill="#adb5bd" font-size="11">
                Pending
              </text>
            `}
          `
        }).join('')}
        
        <!-- Stage 5: Delivery -->
        <circle cx="800" cy="175" r="28" fill="#dc3545" stroke="white" stroke-width="3" />
        <text x="800" y="183" text-anchor="middle" fill="white" font-size="20" font-weight="bold">5</text>
        <text x="800" y="130" text-anchor="middle" fill="#003366" font-size="16" font-weight="700">STAGE 5</text>
        <text x="800" y="230" text-anchor="middle" fill="#003366" font-size="14" font-weight="600">DELIVERY</text>
        
        <!-- Progress indicator -->
        ${completedCheckpoints.length > 0 ? `
          <line x1="100" y1="175" x2="${100 + (completedCheckpoints.length * 200)}" y2="175" 
                stroke="#0055aa" stroke-width="6" stroke-linecap="round" opacity="0.8" />
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
        <div style={{ 
          fontSize: '1rem', 
          color: '#003366',
          fontWeight: 600,
          marginBottom: '0.75rem'
        }}>
          Checkpoints Completed: {checkpoints.filter(cp => cp.location !== null).length} / {checkpoints.length}
        </div>
        
        {checkpoints.filter(cp => cp.location !== null).map(cp => (
          <div key={cp.number} style={{ 
            marginTop: '0.5rem', 
            padding: '0.5rem', 
            background: '#f8f9fa', 
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            <div style={{ fontWeight: 600, color: '#0055aa' }}>
              Checkpoint {cp.number}
            </div>
            <div style={{ color: '#6c757d', marginTop: '0.25rem' }}>
              Location: {cp.address || `${cp.location!.latitude.toFixed(4)}, ${cp.location!.longitude.toFixed(4)}`}
            </div>
            <div style={{ color: '#6c757d', marginTop: '0.25rem' }}>
              Time: {new Date(cp.timestamp!).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ padding: '1rem', background: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
        <p style={{ fontSize: '0.875rem', color: '#495057', margin: 0 }}>
          <strong>Note:</strong> Each checkpoint must be verified by scanning the batch QR code. 
          Location is automatically captured during scanning.
        </p>
      </div>
    </div>
  )
}
