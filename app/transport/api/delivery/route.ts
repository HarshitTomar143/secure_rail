import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { batchUid, transporterId, location, address, timestamp } = body

    if (!batchUid || !transporterId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if transport log exists
    const { data: transportLog, error: logError } = await supabase
      .from('transport_logs')
      .select('*')
      .eq('batch_id', batchUid)
      .eq('transporter_id', transporterId)
      .single()

    if (logError || !transportLog) {
      return NextResponse.json(
        { success: false, error: 'Transport log not found. Please dispatch first.' },
        { status: 404 }
      )
    }

    // Check if already delivered
    if (transportLog.status === 'delivered') {
      return NextResponse.json(
        { success: false, error: 'Batch has already been delivered' },
        { status: 400 }
      )
    }

    // Prepare delivery data
    const deliveryData = {
      timestamp,
      location,
      address: address || 'Delivery location',
      action: 'delivery_completed',
      delivered_by: transporterId
    }

    // Update transport log to mark as delivered
    const { error: updateError } = await supabase
      .from('transport_logs')
      .update({
        status: 'delivered',
        checkpoints_3: JSON.stringify(deliveryData) // Store delivery info in checkpoint 3
      })
      .eq('batch_id', batchUid)
      .eq('transporter_id', transporterId)

    if (updateError) {
      console.error('Error updating delivery:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to complete delivery' },
        { status: 500 }
      )
    }

    // Create receiver record
    const { error: receiverError } = await supabase
      .from('receivers')
      .insert({
        batch_id: batchUid,
        receiver_name: `Delivered by ${transporterId}`,
        receiving_timestamp: timestamp,
        receiving_date: new Date(timestamp).toISOString().split('T')[0],
        location: address || `${location.latitude}, ${location.longitude}`
      })

    if (receiverError) {
      console.error('Error creating receiver record:', receiverError)
      // Don't fail the whole operation if receiver record fails
    }

    // Clear transporter's assigned batch (optional - they can take new batches)
    await supabase
      .from('transporters')
      .update({
        assigned_batch: null
      })
      .eq('id', transporterId)

    return NextResponse.json({
      success: true,
      message: 'Delivery completed successfully',
      delivery: {
        batch_uid: batchUid,
        delivery_location: address || 'Location captured',
        delivery_time: timestamp,
        status: 'delivered'
      }
    })
  } catch (error) {
    console.error('Delivery error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
