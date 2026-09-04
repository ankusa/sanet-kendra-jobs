import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'नौकरी सूचना केंद्र | Sanet Kendra Aligarh',
  description: 'Latest government jobs, apprenticeships and official application links for job seekers in Aligarh.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}
