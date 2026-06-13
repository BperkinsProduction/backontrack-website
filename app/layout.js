import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.backontrackmeets.com'),
  title: 'Back on Track | Pete Wright Memorial Summer All-Comers Track & Field Series',
  description: 'Summer all-comers track & field meets in Hagerstown, MD, for athletes of every age and ability. Free for students. A program of Cumberland Valley Athletic Club, a 501(c)(3) nonprofit.',
  keywords: 'track meet, all-comers, Hagerstown, Maryland, track and field, youth sports, nonprofit, Cumberland Valley Athletic Club, Back on Track',
  alternates: {
    canonical: 'https://www.backontrackmeets.com',
  },
  openGraph: {
    title: 'Back on Track | Summer All-Comers Track & Field Series',
    description: 'Summer all-comers track & field meets in Hagerstown, MD, for all ages and abilities. Free for students.',
    url: 'https://www.backontrackmeets.com',
    type: 'website',
    locale: 'en_US',
    siteName: 'Back on Track Meets',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Back on Track | Summer All-Comers Track & Field Series',
    description: 'Summer all-comers track & field meets in Hagerstown, MD, for all ages and abilities. Free for students.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,200;0,400;0,700;0,900;1,900&display=swap"
        />
        <link rel="icon" href="/logo-icon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Back on Track" />
      </head>
      <body>{children}</body>
    </html>
  );
}
