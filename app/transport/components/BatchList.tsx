'use client'

import { useState } from 'react'
import CheckpointUpdateWithQR from './CheckpointUpdateWithQR'
import RouteMap from './RouteMap'
import '../transport.css'

interface Batch {
  batch_id: string
  vendor_name: string
  factory_name: string
  factory_location: string
  status: string
  destination: string
  checkpoints_1: string | null
  checkpoints_2: string | null
  checkpoints_3: string | null
}

interface BatchListProps {
  batches: Batch[]
  transporterId: string
}

export default function BatchList({ batches, transporterId }: BatchListProps) {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCheckpointUpdate = () => {
    // Refresh the batch list after checkpoint update
    setRefreshKey(prev => prev + 1)
    window.location.reload() // Simple refresh for now
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'dispatched':
        return 'status-dispatched'
      case 'in_transit':
        return 'status-in_transit'
      case 'delivered':
        return 'status-delivered'
      default:
        return ''
    }
  }

  const parseCheckpoint = (checkpoint: string | null) => {
    if (!checkpoint) return null
    try {
      return JSON.parse(checkpoint)
    } catch {
      return null
    }
  }

  const isDispatchData = (checkpoint: any) => {
    return checkpoint && checkpoint.action === 'dispatch_initiated'
  }

  const isDeliveryData = (checkpoint: any) => {
    return checkpoint && checkpoint.action === 'delivery_completed'
  }

  const formatCheckpointTime = (checkpoint: any) => {
    if (!checkpoint || !checkpoint.timestamp) return 'Not recorded'
    return new Date(checkpoint.timestamp).toLocaleString()
  }

  const formatCheckpointLocation = (checkpoint: any) => {
    if (!checkpoint || !checkpoint.location) return 'No location'
    const { latitude, longitude } = checkpoint.location
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
  }

  return (
    <div className="dashboard-grid">
      {batches.map((batch) => {
        const cp1 = parseCheckpoint(batch.checkpoints_1)
        const cp2 = parseCheckpoint(batch.checkpoints_2)
        const cp3 = parseCheckpoint(batch.checkpoints_3)

        return (
          <div key={batch.batch_id} className="batch-card">
            <div className="batch-header">
              <div className="batch-id">Batch: {batch.batch_id}</div>
              <span className={`batch-status ${getStatusClass(batch.status)}`}>
                {batch.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="batch-info">
              <div className="info-row">
                <span className="info-label">Vendor:</span>
                <span className="info-value">{batch.vendor_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Factory:</span>
                <span className="info-value">{batch.factory_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Location:</span>
                <span className="info-value">{batch.factory_location}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Destination:</span>
                <span className="info-value">{batch.destination || 'Not specified'}</span>
              </div>
            </div>

            <div className="checkpoint">
              <div className="checkpoint-header">Journey Progress</div>
              
              {/* Show dispatch info if checkpoint 1 is dispatch */}
              {cp1 && isDispatchData(cp1) && (
                <div style={{ 
                  padding: '0.75rem', 
                  background: '#d4edda', 
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontWeight: 600, color: '#155724' }}>🚚 Dispatched</div>
                  <div style={{ fontSize: '0.875rem', color: '#155724', marginTop: '0.25rem' }}>
                    {formatCheckpointTime(cp1)} from {cp1.address || 'Dispatch point'}
                  </div>
                </div>
              )}
              
              {/* Show delivery info if checkpoint 3 is delivery */}
              {cp3 && isDeliveryData(cp3) && (
                <div style={{ 
                  padding: '0.75rem', 
                  background: '#cce5ff', 
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontWeight: 600, color: '#004085' }}>📍 Delivered</div>
                  <div style={{ fontSize: '0.875rem', color: '#004085', marginTop: '0.25rem' }}>
                    {formatCheckpointTime(cp3)} at {cp3.address || 'Delivery point'}
                  </div>
                </div>
              )}
              
              <div className="checkpoint-grid">
                <div className={`checkpoint-item ${cp1 ? 'checkpoint-completed' : ''}`}>
                  <div className="checkpoint-number">1</div>
                  <div className="checkpoint-status">
                    {cp1 ? 'Completed' : 'Pending'}
                  </div>
                  {cp1 && (
                    <div className="checkpoint-details">
                      <div>{formatCheckpointTime(cp1)}</div>
                      <div>{formatCheckpointLocation(cp1)}</div>
                    </div>
                  )}
                </div>

                <div className={`checkpoint-item ${cp2 ? 'checkpoint-completed' : ''}`}>
                  <div className="checkpoint-number">2</div>
                  <div className="checkpoint-status">
                    {cp2 ? 'Completed' : 'Pending'}
                  </div>
                  {cp2 && (
                    <div className="checkpoint-details">
                      <div>{formatCheckpointTime(cp2)}</div>
                      <div>{formatCheckpointLocation(cp2)}</div>
                    </div>
                  )}
                </div>

                <div className={`checkpoint-item ${cp3 ? 'checkpoint-completed' : ''}`}>
                  <div className="checkpoint-number">3</div>
                  <div className="checkpoint-status">
                    {cp3 ? 'Completed' : 'Pending'}
                  </div>
                  {cp3 && (
                    <div className="checkpoint-details">
                      <div>{formatCheckpointTime(cp3)}</div>
                      <div>{formatCheckpointLocation(cp3)}</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                {selectedBatch === batch.batch_id ? (
                  <CheckpointUpdateWithQR
                    batchId={batch.batch_id}
                    transporterId={transporterId}
                    currentCheckpoints={{
                      checkpoint1: !!cp1,
                      checkpoint2: !!cp2,
                      checkpoint3: !!cp3
                    }}
                    onUpdate={handleCheckpointUpdate}
                    onCancel={() => setSelectedBatch(null)}
                  />
                ) : (
                  <button
                    className="btn btn-small"
                    onClick={() => setSelectedBatch(batch.batch_id)}
                    disabled={batch.status === 'delivered'}
                  >
                    📷 Scan QR & Update Checkpoint
                  </button>
                )}
              </div>
            </div>

            {/* Add Route Map */}
            {selectedBatch === batch.batch_id && (
              <RouteMap 
                checkpoints={[
                  { 
                    number: 1, 
                    location: cp1?.location || null, 
                    timestamp: cp1?.timestamp || null,
                    address: cp1?.address
                  },
                  { 
                    number: 2, 
                    location: cp2?.location || null, 
                    timestamp: cp2?.timestamp || null,
                    address: cp2?.address
                  },
                  { 
                    number: 3, 
                    location: cp3?.location || null, 
                    timestamp: cp3?.timestamp || null,
                    address: cp3?.address
                  }
                ]}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
