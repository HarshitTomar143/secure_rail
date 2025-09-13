'use client'

import { useState, useRef, useEffect } from 'react'
import QrScanner from 'qr-scanner'
import '../transport.css'

interface QRUploaderProps {
  transporterId: string
  onBatchLinked?: (batchId: string) => void
}

export default function QRUploader({ transporterId, onBatchLinked }: QRUploaderProps) {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-fetch location when component mounts
  useEffect(() => {
    fetchLocation()
  }, [])

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        console.error('Error getting location:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setScanning(true)
    setError('')
    setResult('')

    // Auto-fetch location when scanning QR
    fetchLocation()

    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true
      })
      
      if (result.data) {
        setResult(result.data)
        await linkBatchToTransporter(result.data)
      } else {
        setError('No QR code found in the image')
      }
    } catch (err) {
      setError('Failed to scan QR code. Please try again.')
      console.error('QR scan error:', err)
    } finally {
      setScanning(false)
    }
  }

  const linkBatchToTransporter = async (batchUid: string) => {
    setLoading(true)
    setError('')

    try {
      // First, verify the batch exists in vendors table
      const response = await fetch('/transport/api/link-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchUid,
          transporterId,
          location // Include the auto-fetched location
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (onBatchLinked) {
          onBatchLinked(batchUid)
        }
        setResult(`Successfully linked batch: ${batchUid}`)
        // Refresh the page after successful linking
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setError(data.error || 'Failed to link batch')
      }
    } catch (err) {
      setError('An error occurred while linking the batch')
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
    <div className="qr-scanner-container">
      <div className="card-header">
        <h3 className="card-title">QR Code Scanner</h3>
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

      {location && (
        <div className="location-info" style={{ marginBottom: '1rem' }}>
          <div className="location-label">Current Location (Auto-captured)</div>
          <div className="location-coords">
            Lat: {location.latitude.toFixed(6)}, 
            Lng: {location.longitude.toFixed(6)}
          </div>
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
          {scanning ? 'Scanning...' : 'Click to upload or drag & drop QR code image'}
        </div>
        <div className="upload-hint">
          Supports: JPG, PNG, GIF
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {loading && (
        <div className="spinner"></div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button
          className="btn btn-secondary"
          onClick={fetchLocation}
        >
          Refresh Location
        </button>
      </div>
    </div>
  )
}
