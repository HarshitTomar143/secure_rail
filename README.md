# SecureRail - Smart Railway Transport & Security Management System

🚂 A comprehensive Next.js-based web application for railway shipment tracking, security management, and transport operations. Built for Smart India Hackathon 2025 (SIH2025021).

## 🎯 Overview

SecureRail provides end-to-end tracking and management of railway shipments with real-time GPS location tracking, QR code-based verification, and multi-stage checkpoint monitoring.

## ✨ Features

### Core Functionality
- **Role-based Authentication**: Multiple user roles (Admin, Vendor, Transport)
- **Dynamic Dashboard Routing**: Role-specific dashboards with tailored features
- **Real-time Tracking**: GPS-based location tracking for all shipments
- **QR Code Verification**: Secure batch verification at each checkpoint

### Transport Module Features
- **Dispatch & Delivery Management**: Complete workflow from pickup to delivery
- **5-Stage Route Progress Tracking**:
  - Stage 1: Dispatch (Start Point)
  - Stages 2-4: Checkpoints (Transit Verification)
  - Stage 5: Delivery (End Point)
- **Mandatory GPS Location**: Automatic location capture during QR scanning
- **Visual Route Progress**: Interactive SVG-based progress visualization
- **Batch Management**: Track multiple shipments simultaneously
- **Real-time Updates**: Live status updates at each checkpoint

### Security Features
- **Supabase Authentication**: Secure user authentication and session management
- **Location Verification**: Mandatory GPS coordinates for audit trail
- **QR-based Validation**: Unique QR codes for each batch/shipment
- **Checkpoint History**: Complete tracking history with timestamps and locations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser with location services support (Chrome, Edge, Firefox)
- Git for version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/HarshitTomar143/secure_rail.git
cd secure_rail
```

#### 2. Checkout Feature Branch (for latest features)

```bash
git checkout feature-branch
```

#### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 4. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: API endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### 5. Run Development Server

```bash
npm run dev
# or with Turbopack (faster)
npm run dev --turbopack
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing the Application

### Testing Transport Features

1. **Access Transport Module**:
   - Navigate to `http://localhost:3000/transport/login`
   - Login with transport credentials

2. **Testing Dispatch/Delivery**:
   - Click "Start Dispatch" or "Complete Delivery"
   - Allow location access when prompted (REQUIRED)
   - Scan or upload a QR code image
   - System will capture GPS location automatically
   - Verify the checkpoint update in Route Progress

3. **Location Permissions Setup**:
   - **Chrome/Edge**: Click lock icon in address bar → Site Settings → Location → Allow
   - **Firefox**: Click lock icon → Connection Secure → More Information → Permissions → Access Your Location → Allow
   - **Windows**: Settings → Privacy → Location → Allow apps to access location

### Test Credentials (Development)

```javascript
// Transport User
Email: transport@test.com
Password: test123

// Admin User
Email: admin@test.com
Password: admin123

// Vendor User
Email: vendor@test.com
Password: vendor123
```

## 📁 Project Structure

```
secure_rail/
├── app/
│   ├── page.js                    # Main login page
│   ├── admin/
│   │   └── dashboard/              # Admin dashboard
│   ├── vendor/
│   │   └── dashboard/              # Vendor dashboard
│   └── transport/
│       ├── login/                  # Transport login
│       ├── dashboard/              # Transport dashboard
│       ├── components/
│       │   ├── BatchList.tsx       # Batch management
│       │   ├── DispatchDeliveryScanner.tsx  # QR scanner with GPS
│       │   ├── RouteMap.tsx        # Route progress visualization
│       │   └── TransportDashboard.tsx  # Main dashboard
│       ├── api/
│       │   ├── dispatch/           # Dispatch API endpoint
│       │   └── delivery/           # Delivery API endpoint
│       └── transport.css           # Transport module styles
├── lib/
│   └── supabaseClient.js          # Supabase configuration
├── public/                         # Static assets
└── package.json                    # Dependencies
```

## 🔄 Application Workflows

### Authentication Flow
1. User selects role (Admin/Vendor/Transport) on login page
2. Enters credentials and submits form
3. System authenticates with Supabase
4. User profile is fetched to verify role
5. User is redirected to appropriate dashboard:
   - Admins → `/admin/dashboard`
   - Vendors → `/vendor/dashboard`
   - Transport → `/transport/dashboard`

### Transport Workflow
1. **Dispatch Phase**:
   - Transport user scans batch QR code
   - GPS location is captured automatically
   - Batch status updates to "In Transit"
   - Route progress shows Stage 1 complete

2. **Checkpoint Updates**:
   - Scan QR at each checkpoint (Stages 2-4)
   - Location and timestamp recorded
   - Progress visualization updates in real-time

3. **Delivery Phase**:
   - Final QR scan at destination
   - Delivery confirmation with location proof
   - Batch marked as "Delivered"
   - Complete audit trail available

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### Location Access Issues
- **Error**: "Unable to get location"
- **Solution**: 
  1. Check browser location permissions
  2. Ensure HTTPS connection (or localhost)
  3. Check Windows location settings
  4. Try disabling VPN if active

#### QR Scanning Issues
- **Error**: "No QR code found"
- **Solution**: 
  1. Ensure image contains valid QR code
  2. Image should be clear and well-lit
  3. Try PNG or JPG format
  4. QR code should be at least 200x200px

#### Development Server Issues
- **Error**: Module not found errors
- **Solution**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run dev
  ```

## 🔧 Technologies Used

- **Frontend**: Next.js 15.5.3, React 19.1.0, TypeScript
- **Authentication**: Supabase Auth
- **Styling**: TailwindCSS 4.0
- **QR Scanning**: qr-scanner library
- **Location Services**: Browser Geolocation API
- **Maps**: OpenStreetMap (Nominatim for geocoding)

## 📊 API Endpoints

### Transport Module APIs

#### POST `/transport/api/dispatch`
```json
{
  "batchUid": "string",
  "transporterId": "string",
  "location": {
    "latitude": number,
    "longitude": number
  },
  "address": "string",
  "timestamp": "ISO 8601 string"
}
```

#### POST `/transport/api/delivery`
```json
{
  "batchUid": "string",
  "transporterId": "string",
  "location": {
    "latitude": number,
    "longitude": number
  },
  "address": "string",
  "timestamp": "ISO 8601 string"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is developed for Smart India Hackathon 2025.

## 🏆 Acknowledgments

- Smart India Hackathon 2025 (Problem Statement: SIH2025021)
- Indian Railways for the problem statement
- Next.js and React communities

## 📞 Support

For issues and questions:
- Create an issue on [GitHub](https://github.com/HarshitTomar143/secure_rail/issues)
- Contact the development team

---

**Note**: This is a development version. For production deployment, ensure proper security configurations, HTTPS setup, and production-grade database connections.
