# SecureRails - Railway Management System

This is a Next.js-based web application for railway management with role-based authentication and dashboard routing.

## Features

- **Role-based Authentication**: Separate login for vendors and admins
- **Dynamic Dashboard Routing**: Users are redirected to appropriate dashboards based on their role
- **Admin Dashboard**: Comprehensive management interface for system administrators
- **Vendor Dashboard**: Dedicated portal for vendor operations and order management
- **Supabase Integration**: Secure authentication and user profile management

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase project URL and API key.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Application Structure

- `app/page.js` - Login page with role selection
- `app/admin/dashboard/page.js` - Admin dashboard
- `app/vendor/dashboard/page.js` - Vendor dashboard
- `lib/supabaseClient.js` - Supabase configuration

## Authentication Flow

1. User selects role (Vendor or Admin) on login page
2. Enters credentials and submits form
3. System authenticates with Supabase
4. User profile is fetched to verify role
5. User is redirected to appropriate dashboard:
   - Admins → `/admin/dashboard`
   - Vendors → `/vendor/dashboard`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
