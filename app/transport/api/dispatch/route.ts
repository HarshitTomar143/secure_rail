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

    // Check if batch exists in vendors table
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('batch_uid', batchUid)
      .single()

    if (vendorError || !vendor) {
      return NextResponse.json(
        { success: false, error: 'Batch not found in vendor records' },
        { status: 404 }
      )
    }

    // Check if transport log exists
    console.log('Checking for existing transport log:', { batchUid, transporterId })
    const { data: existingLog, error: existingError } = await supabase
      .from('transport_logs')
      .select('*')
      .eq('batch_id', batchUid)
      .eq('transporter_id', transporterId)
      .single()
    
    console.log('Existing log:', existingLog, 'Error:', existingError)

    if (existingLog) {
      // Update existing log to mark as dispatched with location
      const dispatchData = {
        timestamp,
        location,
        address: address || 'Dispatch location',
        action: 'dispatch_initiated'
      }

      const { error: updateError } = await supabase
        .from('transport_logs')
        .update({
          status: 'dispatched',
          destination: vendor.factory_location || address,
          // Store dispatch info separately, not in checkpoint
          // We can use the destination field to store dispatch details
        })
        .eq('batch_id', batchUid)
        .eq('transporter_id', transporterId)

      if (updateError) {
        console.error('Error updating dispatch:', updateError)
        return NextResponse.json(
          { success: false, error: 'Failed to initiate dispatch' },
          { status: 500 }
        )
      }
    } else {
      // Create new transport log with dispatch info
      const dispatchData = {
        timestamp,
        location,
        address: address || 'Dispatch location',
        action: 'dispatch_initiated'
      }

      const { error: insertError } = await supabase
        .from('transport_logs')
        .insert({
          batch_id: batchUid,
          transporter_id: transporterId,
          status: 'dispatched',
          destination: vendor.factory_location || address
          // Checkpoints remain null until actually reached
        })

      if (insertError) {
        console.error('Error creating dispatch log:', insertError)
        return NextResponse.json(
          { success: false, error: 'Failed to create dispatch log' },
          { status: 500 }
        )
      }
    }

    // Update transporter's assigned batch
    await supabase
      .from('transporters')
      .update({
        assigned_batch: batchUid
      })
      .eq('id', transporterId)

    return NextResponse.json({
      success: true,
      message: 'Dispatch initiated successfully',
      batch: {
        batch_uid: batchUid,
        vendor_name: vendor.name,
        factory_name: vendor.factory_name,
        dispatch_location: address || 'Location captured',
        dispatch_time: timestamp
      }
    })
  } catch (error) {
    console.error('Dispatch error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
