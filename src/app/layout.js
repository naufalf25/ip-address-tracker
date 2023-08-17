import './globals.css';
import { Rubik } from 'next/font/google';

const rubik = Rubik({ subsets: ['latin'] });

export const metadata = {
  title: 'IP Address Tracker',
  description:
    'Welcome to our website. This website using to track the IP Address, you can check the location of the IP Address using this website. Thanks for using our website!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
