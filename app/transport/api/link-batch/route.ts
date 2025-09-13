import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { batchUid, transporterId, location } = body

    if (!batchUid || !transporterId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // First, check if the batch exists in vendors table
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

    // Check if transport log already exists for this batch
    const { data: existingLog } = await supabase
      .from('transport_logs')
      .select('*')
      .eq('batch_id', batchUid)
      .single()

    if (existingLog) {
      // Update existing log with new transporter
      const { error: updateError } = await supabase
        .from('transport_logs')
        .update({
          transporter_id: transporterId
        })
        .eq('batch_id', batchUid)

      if (updateError) {
        console.error('Error updating transport log:', updateError)
        return NextResponse.json(
          { success: false, error: 'Failed to link batch' },
          { status: 500 }
        )
      }
    } else {
      // Create new transport log
      const { error: insertError } = await supabase
        .from('transport_logs')
        .insert({
          batch_id: batchUid,
          transporter_id: transporterId,
          status: 'dispatched',
          destination: vendor.factory_location || 'TBD'
        })

      if (insertError) {
        console.error('Error creating transport log:', insertError)
        return NextResponse.json(
          { success: false, error: 'Failed to create transport log' },
          { status: 500 }
        )
      }
    }

    // Update transporter's assigned batch
    const { error: transporterError } = await supabase
      .from('transporters')
      .update({
        assigned_batch: batchUid
      })
      .eq('id', transporterId)

    if (transporterError) {
      console.error('Error updating transporter:', transporterError)
    }

    return NextResponse.json({
      success: true,
      message: 'Batch successfully linked',
      vendor: {
        name: vendor.name,
        factory_name: vendor.factory_name,
        factory_location: vendor.factory_location
      }
    })
  } catch (error) {
    console.error('Batch linking error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
