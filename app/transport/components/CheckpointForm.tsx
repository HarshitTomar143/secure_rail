'use client'

import { useState, useEffect } from 'react'
import '../transport.css'

interface CheckpointFormProps {
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

export default function CheckpointForm({
  batchId,
  transporterId,
  currentCheckpoints,
  onUpdate,
  onCancel
}: CheckpointFormProps) {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gettingLocation, setGettingLocation] = useState(false)

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

  const getLocation = () => {
    setGettingLocation(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setGettingLocation(false)
      },
      (error) => {
        setError('Unable to retrieve your location. Please check your permissions.')
        setGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSubmit = async () => {
    if (!selectedCheckpoint) {
      setError('Please select a checkpoint')
      return
    }

    if (!location) {
      setError('Please capture your location first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/transport/api/checkpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchId,
          transporterId,
          checkpointNumber: selectedCheckpoint,
          location,
          timestamp: new Date().toISOString()
        }),
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
        <h3 className="card-title">Update Checkpoint</h3>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Select Checkpoint</label>
        <select
          className="form-input"
          value={selectedCheckpoint || ''}
          onChange={(e) => setSelectedCheckpoint(Number(e.target.value))}
          disabled={loading}
        >
          <option value="">Choose checkpoint...</option>
          {availableCheckpoints.map(cp => (
            <option key={cp} value={cp}>
              Checkpoint {cp}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Current Location</label>
        {location ? (
          <div className="location-info">
            <div className="location-label">Coordinates Captured</div>
            <div className="location-coords">
              Lat: {location.latitude.toFixed(6)}, 
              Lng: {location.longitude.toFixed(6)}
            </div>
          </div>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={getLocation}
            disabled={gettingLocation || loading}
          >
            {gettingLocation ? 'Getting Location...' : 'Capture Location'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={loading || !location || !selectedCheckpoint}
        >
          {loading ? 'Updating...' : 'Update Checkpoint'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
