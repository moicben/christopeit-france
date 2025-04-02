import '@styles/globals.css';
import '../styles/products.css';
import '../styles/product-page.css';
import '../styles/responsive.css';
import '../styles/header.css';
import '../styles/footer.css';
import '../styles/faq.css';
import '../styles/suivre-mon-colis.css';
import '../styles/reviews.css';	
import '../styles/partners.css';
import '../styles/paiement.css';
import '../styles/ReviewsBadge.css';
import '../styles/contact.css';
import '../styles/ScrollingBanner.css'; 
import '../styles/Categories.css';
import '../styles/about.css';
import '../styles/Testimonials.css';

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

import Head from '../components/Head';


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head />
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default MyApp;