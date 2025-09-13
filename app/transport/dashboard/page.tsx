import { redirect } from 'next/navigation'
import { getTransporterSession } from '../lib/auth'
import { supabase } from '../lib/supabase'
import BatchList from '../components/BatchList'
import DispatchDeliveryScanner from '../components/DispatchDeliveryScanner'
import '../transport.css'

async function getTransporterBatches(transporterId: string) {
  // Get transport logs with vendor details in a single query using join
  const { data: transportLogs, error: logsError } = await supabase
    .from('transport_logs')
    .select(`
      batch_id,
      status,
      destination,
      checkpoints_1,
      checkpoints_2,
      checkpoints_3
    `)
    .eq('transporter_id', transporterId)

  if (logsError) {
    console.error('Error fetching transport logs:', logsError)
    return []
  }

  if (!transportLogs || transportLogs.length === 0) {
    return []
  }

  // Get all batch IDs for a single vendor query
  const batchIds = transportLogs.map(log => log.batch_id)
  
  // Fetch all vendors in one query
  const { data: vendors } = await supabase
    .from('vendors')
    .select('batch_uid, name, factory_name, factory_location')
    .in('batch_uid', batchIds)

  // Create a map for quick vendor lookup
  const vendorMap = new Map()
  vendors?.forEach(vendor => {
    vendorMap.set(vendor.batch_uid, vendor)
  })

  // Combine the data
  const batchesWithVendorInfo = transportLogs.map(log => {
    const vendor = vendorMap.get(log.batch_id)
    return {
      batch_id: log.batch_id,
      vendor_name: vendor?.name || 'Unknown Vendor',
      factory_name: vendor?.factory_name || 'Unknown Factory',
      factory_location: vendor?.factory_location || 'Unknown Location',
      status: log.status,
      destination: log.destination,
      checkpoints_1: log.checkpoints_1,
      checkpoints_2: log.checkpoints_2,
      checkpoints_3: log.checkpoints_3
    }
  })

  return batchesWithVendorInfo
}

export default async function DashboardPage() {
  const transporter = await getTransporterSession()

  if (!transporter) {
    redirect('/transport/login')
  }

  const batches = await getTransporterBatches(transporter.id)

  return (
    <div>
      <div className="nav-header">
        <div className="user-info">
          <h1>Transport Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Welcome, {transporter.name}</span>
            <form action="/transport/api/logout" method="POST" style={{ display: 'inline' }}>
              <button type="submit" className="btn btn-small btn-secondary">
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Information</h2>
          </div>
          <div className="batch-info">
            <div className="info-row">
              <span className="info-label">Transporter ID:</span>
              <span className="info-value">{transporter.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{transporter.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Contact:</span>
              <span className="info-value">{transporter.contact || 'Not provided'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Assigned Batches:</span>
              <span className="info-value">{batches.length}</span>
            </div>
          </div>
        </div>

        <DispatchDeliveryScanner 
          transporterId={transporter.id}
        />

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Assigned Batches</h2>
          </div>
          
          {batches.length === 0 ? (
            <div className="alert alert-info">
              No batches assigned yet. Scan a QR code to link a batch.
            </div>
          ) : (
            <BatchList 
              batches={batches}
              transporterId={transporter.id}
            />
          )}
        </div>
      </div>
    </div>
  )
}
