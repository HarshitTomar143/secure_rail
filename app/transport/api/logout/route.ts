import { NextResponse } from 'next/server'
import { clearTransporterSession } from '../../lib/auth'
import { redirect } from 'next/navigation'

export async function POST() {
  await clearTransporterSession()
  redirect('/transport/login')
}
