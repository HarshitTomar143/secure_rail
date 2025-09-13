import { redirect } from 'next/navigation'
import { getTransporterSession } from './lib/auth'

export default async function TransportPage() {
  const transporter = await getTransporterSession()
  
  if (transporter) {
    redirect('/transport/dashboard')
  } else {
    redirect('/transport/login')
  }
}
