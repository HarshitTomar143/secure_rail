import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { batchId, transporterId, checkpointNumber, location, timestamp, address, verifiedByQR } = body

    if (!batchId || !transporterId || !checkpointNumber || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare checkpoint data with enhanced information
    const checkpointData = JSON.stringify({
      timestamp,
      location,
      address: address || 'Location not resolved',
      recorded_by: transporterId,
      verified_by_qr: verifiedByQR || false,
      recorded_at: new Date().toISOString()
    })

    // Determine which checkpoint field to update
    const checkpointField = `checkpoints_${checkpointNumber}`

    // Update the transport log
    const { data, error } = await supabase
      .from('transport_logs')
      .update({
        [checkpointField]: checkpointData,
        status: checkpointNumber === 3 ? 'delivered' : 'in_transit'
      })
      .eq('batch_id', batchId)
      .eq('transporter_id', transporterId)

    if (error) {
      console.error('Error updating checkpoint:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update checkpoint' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Checkpoint ${checkpointNumber} updated successfully`
    })
  } catch (error) {
    console.error('Checkpoint update error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
