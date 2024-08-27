
import NavBar from '@/components/navBar';
import Footer from '@/components/footer';
import '@/styles/globals.css';
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Plant Store</title>
      </Head>
      <body data-theme='mytheme'>
        <NavBar />
        <div className="min-h-screen">{children}</div> {/* Ensures footer is at the bottom */}
        <Footer /> {/* Include the Footer component */}
      </body>
    </html>
  );
}
