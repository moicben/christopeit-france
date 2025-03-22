import '@styles/globals.css';
import '../styles/products.css'; // Importer le fichier CSS
import '../styles/product-page.css';
import '../styles/responsive.css'; // Importer le fichier CSS
import '../styles/header.css'; // Importer le fichier CSS
import '../styles/footer.css';
import '../styles/faq.css'; // Importer le fichier CSS
import '../styles/suivre-mon-colis.css'; // Importer le fichier CSS
import '../styles/reviews.css'; // Importer le fichier CSS	
import '../styles/partners.css'; // Importer le fichier CSS
import '../styles/paiement.css';
import '../styles/ReviewsBadge.css';
import '../styles/contact.css';
import '../styles/ScrollingBanner.css'; 
import '../styles/Categories.css';

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