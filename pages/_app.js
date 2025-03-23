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

import content from '../content.json';
import Head from '../components/Head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head 
        title={content.sites[0].keyword}
        description="Boutique officielle de Christopeit France, distributeur exclusif de la marque Christopeit en France." 
        favicon="/favicon.png" 
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;