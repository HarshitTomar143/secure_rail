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

    // First, check if the transport log exists
    const { data: existingLog, error: checkError } = await supabase
      .from('transport_logs')
      .select('*')
      .eq('batch_id', batchId)
      .eq('transporter_id', transporterId)
      .single()

    if (checkError || !existingLog) {
      console.error('Transport log not found:', checkError)
      return NextResponse.json(
        { success: false, error: 'Transport log not found. Please dispatch first.' },
        { status: 404 }
      )
    }

    console.log('Updating checkpoint:', checkpointField, 'for batch:', batchId)
    console.log('Checkpoint data:', checkpointData)

    // Update the transport log
    // Keep status as in_transit for all checkpoints (delivery is separate)
    const { data, error, count } = await supabase
      .from('transport_logs')
      .update({
        [checkpointField]: checkpointData,
        status: 'in_transit'  // Always in_transit for checkpoints
      })
      .eq('batch_id', batchId)
      .eq('transporter_id', transporterId)
      .select()

    if (error) {
      console.error('Error updating checkpoint:', error)
      return NextResponse.json(
        { success: false, error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      console.error('No rows updated')
      return NextResponse.json(
        { success: false, error: 'No records were updated. Please verify batch and transporter IDs.' },
        { status: 400 }
      )
    }

    console.log('Checkpoint updated successfully:', data[0])

    return NextResponse.json({
      success: true,
      message: `Checkpoint ${checkpointNumber} updated successfully`,
      updatedRecord: data[0]
    })
  } catch (error) {
    console.error('Checkpoint update error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
