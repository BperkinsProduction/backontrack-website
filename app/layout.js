import './globals.css';

export const metadata = {
  title: 'Back on Track | Pete Wright Memorial Summer All-Comers Track & Field Series',
  description: 'Over 20 years of keeping kids and families healthy through community track & field in Hagerstown, MD. A program of Cumberland Valley Athletic Club, a 501(c)(3) nonprofit.',
  keywords: 'track meet, all-comers, Hagerstown, Maryland, track and field, youth sports, nonprofit, Cumberland Valley Athletic Club, Back on Track',
  openGraph: {
    title: 'Back on Track | All-Comers Track & Field Series',
    description: 'Over 20 years of community track & field for all ages in the tri-state region.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Back on Track Meets',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-icon.png" />
        <script src="https://upload-widget.cloudinary.com/latest/global/all.js" async></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
