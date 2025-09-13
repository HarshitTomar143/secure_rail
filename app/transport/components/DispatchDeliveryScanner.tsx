'use client'

import { useState, useRef, useEffect } from 'react'
import QrScanner from 'qr-scanner'
import '../transport.css'

interface DispatchDeliveryScannerProps {
  transporterId: string
  onActionComplete?: () => void
}

type ActionType = 'dispatch' | 'delivery' | null

export default function DispatchDeliveryScanner({ 
  transporterId, 
  onActionComplete 
}: DispatchDeliveryScannerProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [address, setAddress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchLocationWithAddress = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported')
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          setLocation(coords)

          // Try to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
            )
            const data = await response.json()
            if (data.display_name) {
              setAddress(data.display_name)
            }
          } catch (err) {
            console.log('Could not get address:', err)
            setAddress(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`)
          }
          
          resolve()
        },
        (error) => {
          reject('Unable to get location')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!selectedAction) {
      setError('Please select an action (Dispatch or Delivery) first')
      return
    }

    setScanning(true)
    setError('')
    setResult('')

    try {
      // Get location while scanning
      await fetchLocationWithAddress()

      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true
      })
      
      if (result.data) {
        setResult(result.data)
        await processAction(result.data)
      } else {
        setError('No QR code found in the image')
      }
    } catch (err) {
      setError('Failed to scan QR code or get location. Please try again.')
      console.error('QR scan error:', err)
    } finally {
      setScanning(false)
    }
  }

  const processAction = async (batchUid: string) => {
    setLoading(true)
    setError('')

    try {
      const endpoint = selectedAction === 'dispatch' 
        ? '/transport/api/dispatch' 
        : '/transport/api/delivery'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchUid,
          transporterId,
          location,
          address,
          timestamp: new Date().toISOString(),
          action: selectedAction
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(
          selectedAction === 'dispatch'
            ? `✅ Dispatch initiated for batch: ${batchUid}`
            : `✅ Delivery completed for batch: ${batchUid}`
        )
        
        // Reset after success
        setTimeout(() => {
          if (onActionComplete) {
            onActionComplete()
          }
          // Refresh the page to show updated status
          window.location.reload()
          setSelectedAction(null)
          setResult('')
          setLocation(null)
          setAddress('')
        }, 3000)
      } else {
        setError(data.error || `Failed to ${selectedAction} batch`)
      }
    } catch (err) {
      setError(`An error occurred during ${selectedAction}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('dragover')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files
        handleFileUpload({ target: fileInputRef.current } as any)
      }
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">📦 Dispatch & Delivery Management</h3>
      </div>

      <div style={{ padding: '1rem' }}>
        <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
          Select an action and scan the batch QR code:
        </p>

        {/* Action Selection */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <button
            className="dispatch-delivery-btn"
            style={{
              background: selectedAction === 'dispatch' ? '#0055aa' : '#003366',
              color: 'white',
              padding: '1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: scanning || loading ? 'not-allowed' : 'pointer',
              opacity: scanning || loading ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: selectedAction === 'dispatch' ? '0 4px 12px rgba(0, 85, 170, 0.3)' : '0 2px 6px rgba(0, 51, 102, 0.2)',
              transform: selectedAction === 'dispatch' ? 'scale(1.02)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!scanning && !loading && selectedAction !== 'dispatch') {
                e.currentTarget.style.background = '#0055aa'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 85, 170, 0.2)'
              }
            }}
            onMouseLeave={(e) => {
              if (!scanning && !loading && selectedAction !== 'dispatch') {
                e.currentTarget.style.background = '#003366'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 51, 102, 0.2)'
              }
            }}
            onClick={() => setSelectedAction('dispatch')}
            disabled={scanning || loading}
          >
            <div style={{ fontSize: '1.5rem' }}>🚚</div>
            <div style={{ fontWeight: 600, marginTop: '0.5rem' }}>Start Dispatch</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
              Begin journey
            </div>
          </button>

          <button
            className="dispatch-delivery-btn"
            style={{
              background: selectedAction === 'delivery' ? '#0055aa' : '#003366',
              color: 'white',
              padding: '1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: scanning || loading ? 'not-allowed' : 'pointer',
              opacity: scanning || loading ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: selectedAction === 'delivery' ? '0 4px 12px rgba(0, 85, 170, 0.3)' : '0 2px 6px rgba(0, 51, 102, 0.2)',
              transform: selectedAction === 'delivery' ? 'scale(1.02)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!scanning && !loading && selectedAction !== 'delivery') {
                e.currentTarget.style.background = '#0055aa'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 85, 170, 0.2)'
              }
            }}
            onMouseLeave={(e) => {
              if (!scanning && !loading && selectedAction !== 'delivery') {
                e.currentTarget.style.background = '#003366'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 51, 102, 0.2)'
              }
            }}
            onClick={() => setSelectedAction('delivery')}
            disabled={scanning || loading}
          >
            <div style={{ fontSize: '1.5rem' }}>📍</div>
            <div style={{ fontWeight: 600, marginTop: '0.5rem' }}>Complete Delivery</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
              End journey
            </div>
          </button>
        </div>

        {selectedAction && (
          <>
            <div style={{ 
              padding: '1rem', 
              background: selectedAction === 'dispatch' ? '#e7f3ff' : '#d1e7ff',
              border: '1px solid',
              borderColor: selectedAction === 'dispatch' ? '#b8daff' : '#9ec5fe',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <strong style={{ color: '#004085' }}>Selected Action:</strong> 
              <span style={{ color: '#004085' }}>
                {selectedAction === 'dispatch' 
                  ? ' 🚚 Initiate Dispatch - This will start the transport journey'
                  : ' 📍 Complete Delivery - This will mark the batch as delivered'
                }
              </span>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {result && !error && (
              <div className="alert alert-success">
                {result}
              </div>
            )}

            <div
              className="qr-upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📷</div>
              <div className="upload-text">
                {scanning ? 'Scanning & Getting Location...' : `Scan QR to ${selectedAction}`}
              </div>
              <div className="upload-hint">
                Location will be captured automatically
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />

            {location && (
              <div className="location-info" style={{ marginTop: '1rem' }}>
                <div className="location-label">📍 Location Captured</div>
                <div style={{ fontSize: '0.875rem', color: '#495057', marginTop: '0.5rem' }}>
                  {address}
                </div>
                <div className="location-coords">
                  Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </div>
              </div>
            )}

            {loading && (
              <div className="spinner"></div>
            )}
          </>
        )}
      </div>

      {/* Workflow Info */}
      <div style={{ 
        padding: '1rem', 
        background: '#f8f9fa', 
        borderTop: '1px solid #dee2e6',
        fontSize: '0.875rem'
      }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#495057' }}>
          📋 Transport Workflow:
        </div>
        <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#6c757d' }}>
          <li>Start Dispatch - Scan QR when picking up the batch</li>
          <li>Update Checkpoints - Scan QR at each checkpoint during transit</li>
          <li>Complete Delivery - Scan QR when delivering the batch</li>
        </ol>
      </div>
    </div>
  )
}
