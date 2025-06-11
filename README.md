# Responsive News Dashboard

A responsive dashboard application built with Next.js that includes news integration, user authentication, and payout calculation features.

## Features

- **User Authentication:** Secure login and registration with email/password and OAuth options
- **News Integration:** Fetch and display news articles from various sources
- **Advanced Filtering:** Search and filter news by author, date, and type
- **Responsive Design:** Mobile-first approach for all device compatibility
- **Admin Dashboard:** Special features for admin users, including payout management
- **Payout Calculator:** Automatic calculation based on content rates
- **Export Functionality:** Export payout reports as PDF or CSV
- **Dark Mode Support:** Toggle between light and dark themes

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.local.example` to `.env.local` (already done)
   - Update the values as needed
   - The project is now configured to use NewsData.io API

### OAuth Configuration (Optional)

To enable Google OAuth authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add these to your `.env.local`:
   ```bash
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Demo Accounts

For testing purposes, the following demo accounts are available:

- **Admin User**
  - Email: admin@example.com
  - Password: admin123

- **Regular User**
  - Email: user@example.com
  - Password: user123

## Technical Details

This project uses:

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **NextAuth.js** for authentication
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **jsPDF** for PDF export functionality

## Project Structure

- `src/app/*` - Next.js app router pages
- `src/components/*` - Reusable UI components
- `src/redux/*` - Redux state management
- `src/lib/*` - Utility functions and services
- `src/services/*` - API integration services
- `src/types/*` - TypeScript type definitions

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
