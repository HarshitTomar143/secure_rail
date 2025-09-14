'use client'

import { useState, useRef, useEffect } from 'react'
import QrScanner from 'qr-scanner'
import '../transport.css'

interface CheckpointUpdateWithQRProps {
  batchId: string
  transporterId: string
  currentCheckpoints: {
    checkpoint1: boolean
    checkpoint2: boolean
    checkpoint3: boolean
  }
  onUpdate: () => void
  onCancel: () => void
}

export default function CheckpointUpdateWithQR({
  batchId,
  transporterId,
  currentCheckpoints,
  onUpdate,
  onCancel
}: CheckpointUpdateWithQRProps) {
  const [step, setStep] = useState<'scan' | 'confirm'>('scan')
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [address, setAddress] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scannedBatchId, setScannedBatchId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-select next available checkpoint
    if (!currentCheckpoints.checkpoint1) {
      setSelectedCheckpoint(1)
    } else if (!currentCheckpoints.checkpoint2) {
      setSelectedCheckpoint(2)
    } else if (!currentCheckpoints.checkpoint3) {
      setSelectedCheckpoint(3)
    }
  }, [currentCheckpoints])

  // Get location and address using reverse geocoding
  const getLocationWithAddress = async () => {
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

          // Try to get address using reverse geocoding (using free service)
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

    setScanning(true)
    setError('')

    try {
      // Get location while scanning
      await getLocationWithAddress()

      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true
      })
      
      if (result.data) {
        // Strict verification: scanned QR MUST match the assigned batch
        const scannedId = result.data.trim()
        const expectedId = batchId.trim()
        
        if (scannedId === expectedId) {
          setScannedBatchId(scannedId)
          setStep('confirm')
        } else {
          setError(`❌ Wrong Batch QR! Scanned: ${scannedId}, Expected: ${expectedId}. Please scan the correct batch QR.`)
          // Reset after showing error
          setTimeout(() => {
            setError('')
          }, 5000)
        }
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

  const handleSubmit = async () => {
    if (!selectedCheckpoint || !location || !scannedBatchId) {
      setError('Missing required information')
      return
    }

    setLoading(true)
    setError('')

    try {
      const checkpointData = {
        batchId: scannedBatchId,
        transporterId,
        checkpointNumber: selectedCheckpoint,
        location,
        address,
        timestamp: new Date().toISOString(),
        verifiedByQR: true
      }

      console.log('Sending checkpoint data:', checkpointData)

      const response = await fetch('/transport/api/checkpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkpointData),
      })

      const data = await response.json()

      if (data.success) {
        onUpdate()
      } else {
        setError(data.error || 'Failed to update checkpoint')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
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

  const getAvailableCheckpoints = () => {
    const checkpoints = []
    if (!currentCheckpoints.checkpoint1) checkpoints.push(1)
    if (!currentCheckpoints.checkpoint2) checkpoints.push(2)
    if (!currentCheckpoints.checkpoint3) checkpoints.push(3)
    return checkpoints
  }

  const availableCheckpoints = getAvailableCheckpoints()

  if (availableCheckpoints.length === 0) {
    return (
      <div className="alert alert-info">
        All checkpoints have been completed for this batch.
      </div>
    )
  }

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div className="card-header">
        <h3 className="card-title">
          Update Checkpoint {selectedCheckpoint} - Batch {batchId}
        </h3>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {step === 'scan' ? (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Step 1: Scan the QR code on the batch to verify and capture location
            </p>
          </div>

          <div
            className="qr-upload-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ marginBottom: '1rem' }}
          >
            <div className="upload-icon">📷</div>
            <div className="upload-text">
              {scanning ? 'Scanning & Getting Location...' : 'Click to scan batch QR code'}
            </div>
            <div className="upload-hint">
              This will verify the batch and capture your current location
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          {scanning && (
            <div className="spinner"></div>
          )}
        </>
      ) : (
        <>
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            ✓ Batch verified: {scannedBatchId}
          </div>

          <div className="form-group">
            <label className="form-label">Checkpoint</label>
            <select
              className="form-input"
              value={selectedCheckpoint || ''}
              onChange={(e) => setSelectedCheckpoint(Number(e.target.value))}
              disabled={loading}
            >
              {availableCheckpoints.map(cp => (
                <option key={cp} value={cp}>
                  Checkpoint {cp}
                </option>
              ))}
            </select>
          </div>

          {location && (
            <div className="location-info" style={{ marginBottom: '1rem' }}>
              <div className="location-label">📍 Location Captured</div>
              <div style={{ fontSize: '0.875rem', color: '#495057', marginTop: '0.5rem' }}>
                {address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
              </div>
              <div className="location-coords" style={{ marginTop: '0.5rem' }}>
                Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={loading || !location || !selectedCheckpoint}
            >
              {loading ? 'Updating...' : 'Confirm & Update'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setStep('scan')
                setScannedBatchId('')
                setLocation(null)
                setAddress('')
              }}
              disabled={loading}
            >
              Rescan
            </button>
            <button
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  )
}
