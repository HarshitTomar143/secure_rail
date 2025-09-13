import './transport.css'

export const metadata = {
  title: 'Transport Portal - SecureRail',
  description: 'Railway Parts Transport Management System',
}

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
