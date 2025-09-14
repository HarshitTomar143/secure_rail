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
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check location permission on component mount
  useEffect(() => {
    const checkLocationPermission = async () => {
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' })
          setLocationPermission(permission.state as any)
          
          permission.addEventListener('change', () => {
            setLocationPermission(permission.state as any)
          })
        } catch (err) {
          console.log('Could not check permission status:', err)
          setLocationPermission('prompt')
        }
      } else {
        setLocationPermission('prompt')
      }
    }
    
    checkLocationPermission()
  }, [])

  const requestLocationPermission = async () => {
    setError('')
    try {
      await fetchLocationWithAddress()
      setLocationPermission('granted')
    } catch (err: any) {
      console.error('Location permission request failed:', err)
      setError(typeof err === 'string' ? err : 'Failed to get location permission')
    }
  }

  const fetchLocationWithAddress = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser. Please use a modern browser with location support.')
        return
      }

      console.log('Requesting location...')
      // Clear any previous location data
      setLocation(null)
      setAddress('')

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Location obtained successfully:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
          
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
            setAddress(`Lat: ${coords.latitude.toFixed(6)}, Lon: ${coords.longitude.toFixed(6)}`)
          }
          
          resolve()
        },
        (error) => {
          let errorMessage = ''
          // Log full error details for debugging
          console.error('Geolocation error details:', {
            code: error.code,
            message: error.message,
            PERMISSION_DENIED: error.PERMISSION_DENIED,
            POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
            TIMEOUT: error.TIMEOUT
          })
          
          switch(error.code) {
            case 1: // error.PERMISSION_DENIED
              errorMessage = 'Location permission denied. Please enable location access in your browser settings and refresh the page.'
              setLocationPermission('denied')
              break
            case 2: // error.POSITION_UNAVAILABLE
              errorMessage = 'Location information is unavailable. Please check if location services are enabled on your device.'
              break
            case 3: // error.TIMEOUT
              errorMessage = 'Location request timed out. Please try again.'
              break
            default:
              errorMessage = `Unable to get location. Error code: ${error.code}, Message: ${error.message || 'Unknown error'}`
          }
          reject(errorMessage)
        },
        {
          enableHighAccuracy: false, // Changed to false for faster response
          timeout: 30000, // Increased to 30 seconds
          maximumAge: 5000 // Allow cached position up to 5 seconds old
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

    // Check if location permission is denied
    if (locationPermission === 'denied') {
      setError('Location access is required. Please enable location in your browser settings and refresh the page.')
      return
    }

    setScanning(true)
    setError('')
    setResult('')

    try {
      // Get location first - it's mandatory
      try {
        await fetchLocationWithAddress()
      } catch (locationError: any) {
        // Location is mandatory, so we must stop here
        setError(locationError || 'Location is required for tracking. Please enable location access and try again.')
        setScanning(false)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      // Only proceed with QR scanning if we have location
      if (!location) {
        setError('Location could not be determined. Please ensure GPS/location services are enabled and try again.')
        setScanning(false)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true
      })
      
      if (result.data) {
        setResult(result.data)
        await processAction(result.data)
      } else {
        setError('No QR code found in the image')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to scan QR code. Please try again.')
      console.error('QR scan error:', err)
    } finally {
      setScanning(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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

            {/* Location Permission Warning */}
            {locationPermission === 'denied' && (
              <div style={{
                padding: '1rem',
                background: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '8px',
                marginBottom: '1rem',
                color: '#721c24'
              }}>
                <strong>⚠️ Location Access Required</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                  Location tracking is mandatory for transport operations. Please:
                </p>
                <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                  <li>Click on the lock/info icon in your browser's address bar</li>
                  <li>Find "Location" in the permissions</li>
                  <li>Change it to "Allow"</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            )}

            {locationPermission === 'prompt' && (
              <div style={{
                padding: '1rem',
                background: '#fff3cd',
                border: '1px solid #ffeeba',
                borderRadius: '8px',
                marginBottom: '1rem',
                color: '#856404'
              }}>
                <strong>📍 Location Permission Required</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                  We need your location to track shipments. Your browser will ask for permission.
                </p>
                <button
                  onClick={requestLocationPermission}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#0055aa',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Enable Location Access
                </button>
              </div>
            )}

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
              style={{
                pointerEvents: locationPermission === 'denied' ? 'none' : 'auto',
                opacity: locationPermission === 'denied' ? 0.5 : 1
              }}
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
              disabled={locationPermission === 'denied'}
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