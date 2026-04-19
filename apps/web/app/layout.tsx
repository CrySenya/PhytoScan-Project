import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/AuthContext';
import Navbar from '.././components/Navbar';

export const metadata: Metadata = {
  title: 'PhytoScan — Botanical Field Guide',
  description: 'Identify, learn, and share plants with the PhytoScan community',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='bg-green-50 min-h-screen'>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
