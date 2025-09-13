import { supabase } from './supabase'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function authenticateTransporter(username, password) {
  try {
    // Fetch only necessary fields for faster query
    const { data: transporter, error } = await supabase
      .from('transporters')
      .select('id, name, password, contact, assigned_batch')
      .eq('id', username)
      .single()

    if (error || !transporter) {
      return { success: false, error: 'Invalid credentials' }
    }

    // For now, using plain text comparison (as per requirement)
    // In production, you should hash passwords
    const isValid = password === transporter.password

    if (!isValid) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Remove password from response
    const { password: _, ...transporterData } = transporter
    return { success: true, transporter: transporterData }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

export async function getTransporterSession() {
  const cookieStore = await cookies()
  const transporterId = cookieStore.get('transporter_id')
  
  if (!transporterId) {
    return null
  }

  const { data: transporter } = await supabase
    .from('transporters')
    .select('*')
    .eq('id', transporterId.value)
    .single()

  return transporter
}

export async function setTransporterSession(transporterId) {
  const cookieStore = await cookies()
  cookieStore.set('transporter_id', transporterId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export async function clearTransporterSession() {
  const cookieStore = await cookies()
  cookieStore.delete('transporter_id')
}
