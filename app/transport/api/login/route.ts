import { NextResponse } from 'next/server'
import { authenticateTransporter, setTransporterSession } from '../../lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const result = await authenticateTransporter(username, password)

    if (result.success && result.transporter) {
      await setTransporterSession(result.transporter.id)
      
      const response = NextResponse.json({
        success: true,
        transporter: {
          id: result.transporter.id,
          name: result.transporter.name,
          assigned_batch: result.transporter.assigned_batch
        }
      })
      
      // Add cache control headers
      response.headers.set('Cache-Control', 'no-store, max-age=0')
      return response
    }

    return NextResponse.json(
      { success: false, error: result.error },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
